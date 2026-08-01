import prisma from '../prisma.js';
import { requireAdmin } from '../auth.js';
import PDFDocument from 'pdfkit';

export function registerReportsService(app) {
  // Get Sales Dashboard Analytics (Admin)
  app.get('/api/reports/analytics', requireAdmin, async (req, res) => {
    try {
      const [
        totalUsers,
        totalProducts,
        lowStockProducts,
        orders,
        orderItemsGrouped
      ] = await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.product.findMany({
          where: { stock: { lte: 10 } },
          include: { category: true },
          orderBy: { stock: 'asc' }
        }),
        prisma.order.findMany({
          include: {
            user: { select: { name: true, email: true } },
            items: { include: { product: true } }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.orderItem.groupBy({
          by: ['productId'],
          _sum: { quantity: true, totalPrice: true },
          orderBy: { _sum: { quantity: 'desc' } },
          take: 5
        })
      ]);

      const totalRevenue = orders.reduce((sum, order) => sum + (order.status !== 'CANCELLED' ? order.totalAmount : 0), 0);
      const paidOrdersCount = orders.filter(o => o.status !== 'CANCELLED').length;

      // Populate top 5 products details
      const topProductIds = orderItemsGrouped.map(item => item.productId);
      const topProductsData = await prisma.product.findMany({
        where: { id: { in: topProductIds } },
        include: { category: true }
      });

      const topProducts = orderItemsGrouped.map(item => {
        const product = topProductsData.find(p => p.id === item.productId);
        return {
          id: item.productId,
          name: product ? product.name : 'Producto Eliminado',
          category: product ? product.category.name : 'N/A',
          totalQuantity: item._sum.quantity || 0,
          totalRevenue: item._sum.totalPrice || 0
        };
      });

      return res.json({
        metrics: {
          totalUsers,
          totalProducts,
          lowStockCount: lowStockProducts.length,
          totalOrders: orders.length,
          paidOrdersCount,
          totalRevenue
        },
        lowStockProducts,
        topProducts,
        recentOrders: orders.slice(0, 10)
      });
    } catch (err) {
      console.error('Error calculating analytics:', err);
      return res.status(500).json({ error: 'Error al calcular reporte de ventas.' });
    }
  });

  // Generate PDF Sales Report (Admin)
  app.get('/api/reports/pdf', requireAdmin, async (req, res) => {
    try {
      const [orders, lowStockProducts, productsCount] = await Promise.all([
        prisma.order.findMany({
          include: {
            user: { select: { name: true, email: true } },
            items: { include: { product: true } }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.product.findMany({
          where: { stock: { lte: 10 } },
          include: { category: true }
        }),
        prisma.product.count()
      ]);

      const validOrders = orders.filter(o => o.status !== 'CANCELLED');
      const totalRevenue = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);

      // Create PDF
      const doc = new PDFDocument({ margin: 40, size: 'A4' });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="Reporte_Ventas_ElectroTech.pdf"');

      doc.pipe(res);

      // Header
      doc.fillColor('#0b0f19').rect(0, 0, 595.28, 80).fill();
      doc.fillColor('#06b6d4').fontSize(22).font('Helvetica-Bold').text('ElectroTech Studio', 40, 25);
      doc.fillColor('#94a3b8').fontSize(12).font('Helvetica').text('Reporte General de Ventas e Inventario', 40, 50);
      doc.fillColor('#ffffff').fontSize(10).text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 430, 35);

      doc.moveDown(4);

      // Summary Box
      doc.fillColor('#f8fafc').roundedRect(40, 100, 515, 75, 8).fillAndStroke('#e2e8f0', '#cbd5e1');
      doc.fillColor('#1e293b').fontSize(14).font('Helvetica-Bold').text('Resumen Ejecutivo', 55, 112);
      
      doc.fontSize(11).font('Helvetica').fillColor('#334155');
      doc.text(`Ingresos Totales: $${totalRevenue.toFixed(2)} USD`, 55, 135);
      doc.text(`Total de Pedidos Procesados: ${validOrders.length}`, 55, 152);
      doc.text(`Catálogo Activo: ${productsCount} productos`, 300, 135);
      doc.text(`Alertas Bajo Stock (<=10): ${lowStockProducts.length}`, 300, 152);

      // Orders Table Title
      doc.moveDown(4);
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#0f172a').text('Detalle de Pedidos Recientes', 40, 195);

      // Table Header
      let y = 215;
      doc.fillColor('#06b6d4').rect(40, y, 515, 22).fill();
      doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold');
      doc.text('Nº Pedido', 45, y + 6);
      doc.text('Cliente', 140, y + 6);
      doc.text('Estado', 280, y + 6);
      doc.text('Fecha', 370, y + 6);
      doc.text('Total', 480, y + 6);

      y += 22;
      doc.font('Helvetica').fontSize(9).fillColor('#334155');

      orders.slice(0, 15).forEach((order, index) => {
        if (index % 2 === 0) {
          doc.fillColor('#f8fafc').rect(40, y, 515, 20).fill();
        }
        doc.fillColor('#1e293b');
        doc.text(order.orderNumber, 45, y + 5);
        doc.text(order.user.name, 140, y + 5, { width: 130, ellipsis: true });
        doc.text(order.status, 280, y + 5);
        doc.text(new Date(order.createdAt).toLocaleDateString('es-ES'), 370, y + 5);
        doc.text(`$${order.totalAmount.toFixed(2)}`, 480, y + 5);
        y += 20;
      });

      // Low Stock Section if space remains
      y += 20;
      if (y < 700 && lowStockProducts.length > 0) {
        doc.fontSize(14).font('Helvetica-Bold').fillColor('#dc2626').text('Alerta de Productos con Bajo Stock', 40, y);
        y += 20;

        doc.fillColor('#ef4444').rect(40, y, 515, 22).fill();
        doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold');
        doc.text('Producto', 45, y + 6);
        doc.text('Categoría', 250, y + 6);
        doc.text('SKU', 380, y + 6);
        doc.text('Stock Restante', 470, y + 6);

        y += 22;
        doc.font('Helvetica').fontSize(9).fillColor('#334155');

        lowStockProducts.slice(0, 10).forEach((prod, index) => {
          if (index % 2 === 0) {
            doc.fillColor('#fef2f2').rect(40, y, 515, 20).fill();
          }
          doc.fillColor('#991b1b');
          doc.text(prod.name, 45, y + 5, { width: 190, ellipsis: true });
          doc.text(prod.category.name, 250, y + 5);
          doc.text(prod.sku, 380, y + 5);
          doc.text(`${prod.stock} uds.`, 470, y + 5);
          y += 20;
        });
      }

      // Footer
      doc.fillColor('#94a3b8').fontSize(8).text('Generado automáticamente por el Sistema E-Commerce ElectroTech Studio', 40, 800, { align: 'center' });

      doc.end();
    } catch (err) {
      console.error('Error generating PDF:', err);
      return res.status(500).json({ error: 'Error al generar el reporte PDF.' });
    }
  });
}

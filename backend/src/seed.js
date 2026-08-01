import prisma from './prisma.js';
import { hashPassword } from './auth.js';

async function seed() {
  console.log('🌱 Starting Database Seeding...');

  // Clean DB
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const adminPassword = hashPassword('Admin123!');
  const userPassword = hashPassword('Cliente123!');

  const admin = await prisma.user.create({
    data: {
      email: 'admin@electrotech.com',
      password: adminPassword,
      name: 'Admin ElectroTech',
      role: 'ADMIN'
    }
  });

  const client = await prisma.user.create({
    data: {
      email: 'cliente@electrotech.com',
      password: userPassword,
      name: 'Carlos Ruiz',
      role: 'USER'
    }
  });

  console.log('✅ Users created: Admin (admin@electrotech.com), User (cliente@electrotech.com)');

  // Create Categories
  const catMicro = await prisma.category.create({
    data: {
      name: 'Microcontroladores',
      slug: 'microcontroladores',
      description: 'Placas de desarrollo Arduino, ESP32, STM32 y microcontroladores integrados.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80'
    }
  });

  const catSbc = await prisma.category.create({
    data: {
      name: 'Placas Base & SBC',
      slug: 'placas-base-sbc',
      description: 'Single Board Computers de alto rendimiento como Raspberry Pi 5 y Jetson.',
      image: 'https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600&auto=format&fit=crop&q=80'
    }
  });

  const catSensors = await prisma.category.create({
    data: {
      name: 'Módulos & Sensores',
      slug: 'modulos-sensores',
      description: 'Sensores de temperatura, humedad, movimiento, pantallas OLED y comunicación.',
      image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80'
    }
  });

  const catTools = await prisma.category.create({
    data: {
      name: 'Herramientas de Electrónica',
      slug: 'herramientas-electronica',
      description: 'Estaciones de soldadura profesional, multímetros digitales y osciloscopios.',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'
    }
  });

  console.log('✅ Categories created.');

  // Create Products
  const productsData = [
    {
      name: 'ESP32-WROOM-32D Wi-Fi & Bluetooth MCU',
      slug: 'esp32-wroom-32d-wifi-bluetooth',
      description: 'Módulo microcontrolador dual-core de 240MHz con conectividad Wi-Fi 802.11 b/g/n y Bluetooth 4.2 BR/EDR/BLE. Ideal para proyectos IoT y domótica.',
      price: 6.99,
      stock: 45,
      sku: 'MCU-ESP32-WROOM',
      categoryId: catMicro.id,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
      featured: true,
      specifications: {
        "Frecuencia Reloj": "240 MHz Dual Core",
        "SRAM": "520 KB",
        "Flash": "4 MB",
        "Voltaje Operativo": "3.3V"
      }
    },
    {
      name: 'Arduino Uno R4 WiFi Core Board',
      slug: 'arduino-uno-r4-wifi',
      description: 'La nueva generación de la mítica placa Arduino con procesador ARM Cortex-M4 de 32 bits RA4M1 de Renesas y módulo ESP32-S3 para Wi-Fi y Bluetooth.',
      price: 27.50,
      stock: 18,
      sku: 'MCU-ARD-UNOR4',
      categoryId: catMicro.id,
      image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80',
      featured: true,
      specifications: {
        "Procesador": "Renesas RA4M1 (Arm Cortex-M4)",
        "Matriz LED": "12x8 Integrada",
        "Conectividad": "Wi-Fi & BLE via ESP32-S3",
        "Voltaje": "5V"
      }
    },
    {
      name: 'Raspberry Pi 5 - 8GB RAM SBC',
      slug: 'raspberry-pi-5-8gb-ram',
      description: 'Placa ordenador mono-placa con procesador Quad-Core 64-bit Arm Cortex-A76 a 2.4GHz, gráfica VideoCore VII, PCIe 2.0 y soporte dual 4K display.',
      price: 89.99,
      stock: 8, // Low stock for alert test!
      sku: 'SBC-RPI5-8GB',
      categoryId: catSbc.id,
      image: 'https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600&auto=format&fit=crop&q=80',
      featured: true,
      specifications: {
        "CPU": "Broadcom BCM2712 Quad-Core 2.4GHz",
        "RAM": "8GB LPDDR4X",
        "Puertos": "2x USB 3.0, 2x USB 2.0, Gigabit Ethernet",
        "Salida Video": "Dual micro-HDMI 4K60"
      }
    },
    {
      name: 'Raspberry Pi Pico W con Wi-Fi',
      slug: 'raspberry-pi-pico-w',
      description: 'Placa microcontroladora de bajo coste y alto rendimiento basada en el chip RP2040 de Raspberry Pi con chip inalámbrico Infineon CYW43439.',
      price: 7.25,
      stock: 60,
      sku: 'MCU-RPI-PICOW',
      categoryId: catMicro.id,
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: {
        "Chip": "RP2040 Dual ARM Cortex M0+",
        "RAM": "264 KB",
        "Flash": "2 MB",
        "Wi-Fi": "2.4GHz 802.11n"
      }
    },
    {
      name: 'Módulo Pantalla OLED I2C 0.96 Pulgadas SSD1306',
      slug: 'modulo-pantalla-oled-i2c-096-ssd1306',
      description: 'Pantalla gráfica OLED de 128x64 píxeles de color azul con interfaz de comunicación I2C. Consumo ultra bajo y excelente contraste.',
      price: 4.50,
      stock: 35,
      sku: 'MOD-OLED-096I2C',
      categoryId: catSensors.id,
      image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80',
      featured: true,
      specifications: {
        "Resolución": "128 x 64 Píxeles",
        "Controlador": "SSD1306",
        "Interfaz": "I2C (0x3C / 0x3D)",
        "Voltaje": "3.3V - 5V"
      }
    },
    {
      name: 'Sensor Digital Temperatura y Humedad DHT22 (AM2302)',
      slug: 'sensor-temperatura-humedad-dht22',
      description: 'Sensor capacitivo de alta precisión para medir temperatura de -40 a +80 °C (precisión +/-0.5°C) y humedad de 0 a 100% RH con interfaz digital serie.',
      price: 5.80,
      stock: 5, // Low stock alert!
      sku: 'SNS-DHT22-DIG',
      categoryId: catSensors.id,
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: {
        "Rango Temp": "-40 a 80 °C",
        "Precisión Temp": "±0.5 °C",
        "Rango Humedad": "0 - 100% RH",
        "Señal Salida": "Digital Monowire"
      }
    },
    {
      name: 'Kit Módulo Relevador 4 Canales 5V Optoacoplado',
      slug: 'kit-modulo-relevador-4-canales-5v',
      description: 'Módulo de 4 relés mecánicos de 5V con aislamiento por optoacopladores para conmutar cargas de corriente alterna hasta 250V / 10A desde microcontroladores.',
      price: 8.90,
      stock: 22,
      sku: 'MOD-RELAY-4CH',
      categoryId: catSensors.id,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: {
        "Canales": "4 Relés independientes",
        "Carga Máxima AC": "250V AC / 10A",
        "Carga Máxima DC": "30V DC / 10A",
        "Activación": "Lógica Baja (Low Level Trigger)"
      }
    },
    {
      name: 'Estación de Soldar Inteligente TS101 OLED 65W PD',
      slug: 'estacion-de-soldar-ts101-oled-65w',
      description: 'Soldador de precisión tipo cautín portátil con alimentación USB Type-C Power Delivery 65W y DC 12-24V. Calentamiento rápido en 9 segundos.',
      price: 64.90,
      stock: 12,
      sku: 'TL-SOLD-TS101',
      categoryId: catTools.id,
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      featured: true,
      specifications: {
        "Potencia": "65W USB-PD / 90W DC",
        "Rango Temp": "100°C - 400°C",
        "Pantalla": "OLED Integrada",
        "Control": "Chip STM32 con Firmware actualizable"
      }
    },
    {
      name: 'Multímetro Digital Autorango RMS Verdadero 6000 Cuentas',
      slug: 'multimetro-digital-autorango-true-rms',
      description: 'Instrumento de medición profesional con medición True RMS, detector de voltaje sin contacto NCV, capacitancia, frecuencia y temperatura.',
      price: 34.00,
      stock: 4, // Low stock alert!
      sku: 'TL-MULTI-TRMS6K',
      categoryId: catTools.id,
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: {
        "Cuentas Display": "6000 Counts True RMS",
        "Seguridad": "CAT III 600V",
        "Funciones": "NCV, Diodo, Continuidad, Temp, Hz, Farafaradios"
      }
    }
  ];

  const createdProducts = [];
  for (const p of productsData) {
    const prod = await prisma.product.create({ data: p });
    createdProducts.push(prod);
  }

  console.log(`✅ ${createdProducts.length} Products created.`);

  // Create Initial Sample Orders for Sales Charts & PDF Reports
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-202607-1001',
      userId: client.id,
      status: 'PAID',
      totalAmount: 124.48,
      shippingAddress: 'Av. Libertador #450, Santiago',
      paymentMethod: 'CREDIT_CARD',
      createdAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
      items: {
        create: [
          {
            productId: createdProducts[2].id, // RPi 5
            quantity: 1,
            unitPrice: 89.99,
            totalPrice: 89.99
          },
          {
            productId: createdProducts[1].id, // Arduino Uno R4
            quantity: 1,
            unitPrice: 27.50,
            totalPrice: 27.50
          },
          {
            productId: createdProducts[0].id, // ESP32
            quantity: 1,
            unitPrice: 6.99,
            totalPrice: 6.99
          }
        ]
      }
    }
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-202607-1002',
      userId: client.id,
      status: 'SHIPPED',
      totalAmount: 78.30,
      shippingAddress: 'Calle San Martín 102, Depto 4B',
      paymentMethod: 'PAYPAL',
      createdAt: new Date(Date.now() - 86400000 * 1), // 1 day ago
      items: {
        create: [
          {
            productId: createdProducts[7].id, // TS101 Soldering Iron
            quantity: 1,
            unitPrice: 64.90,
            totalPrice: 64.90
          },
          {
            productId: createdProducts[3].id, // Pico W
            quantity: 1,
            unitPrice: 7.25,
            totalPrice: 7.25
          },
          {
            productId: createdProducts[5].id, // DHT22
            quantity: 1,
            unitPrice: 5.80,
            totalPrice: 5.80
          }
        ]
      }
    }
  });

  console.log('✅ Sample Orders created for sales reporting analytics.');
  console.log('🚀 Database seeding completed successfully!');
}

seed()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

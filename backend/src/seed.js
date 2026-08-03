import prisma from './prisma.js';
import { hashPassword } from './auth.js';

async function seed() {
  console.log('🌱 Starting Database Seeding...');

  // 1. Clean existing database data safely in order of dependencies
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned previous database records.');

  // 2. Create Users (1 Admin + 6 Customers)
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

  const customersData = [
    { email: 'carlos.ruiz@gmail.com', name: 'Carlos Ruiz', role: 'USER' },
    { email: 'maria.gonzalez@hotmail.com', name: 'María González', role: 'USER' },
    { email: 'juan.perez@yahoo.com', name: 'Juan Pérez', role: 'USER' },
    { email: 'ana.martinez@outlook.com', name: 'Ana Martínez', role: 'USER' },
    { email: 'lucia.fernandez@gmail.com', name: 'Lucía Fernández', role: 'USER' },
    { email: 'roberto.silva@empresa.com', name: 'Roberto Silva', role: 'USER' }
  ];

  const createdCustomers = [];
  for (const c of customersData) {
    const cust = await prisma.user.create({
      data: {
        email: c.email,
        password: userPassword,
        name: c.name,
        role: c.role
      }
    });
    createdCustomers.push(cust);
  }

  console.log(`✅ 1 Admin and ${createdCustomers.length} Customers created.`);

  // 3. Create Categories
  const categoriesData = [
    {
      name: 'Microcontroladores & IoT',
      slug: 'microcontroladores-iot',
      description: 'Placas de desarrollo Arduino, ESP32, STM32 y módulos integrados para IoT.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'Placas Base & SBC',
      slug: 'placas-base-sbc',
      description: 'Single Board Computers de alto rendimiento como Raspberry Pi, Orange Pi y Jetson.',
      image: 'https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'Módulos & Sensores',
      slug: 'modulos-sensores',
      description: 'Sensores de precisión de ambiente, distancia, gas, bio-señales y pantallas.',
      image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'Herramientas de laboratorio',
      slug: 'herramientas-laboratorio',
      description: 'Estaciones de soldadura, osciloscopios, multímetros y fuentes programables.',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'Robótica & Motores',
      slug: 'robotica-motores',
      description: 'Servomotores, motores paso a paso NEMA, drivers L298N y chasis robóticos.',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'Fuentes de Alimentación & Baterías',
      slug: 'fuentes-alimentacion-baterias',
      description: 'Convertidores DC-DC Buck/Boost, cargadores LiPo y fuentes reguladas.',
      image: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'Componentes Pasivos & Semiconductores',
      slug: 'componentes-pasivos-semiconductores',
      description: 'Resistencias, condensadores, transistores, diodos, triacs y circuitos integrados.',
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&auto=format&fit=crop&q=80'
    }
  ];

  const createdCategories = {};
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.create({ data: cat });
    createdCategories[cat.slug] = createdCat.id;
  }

  console.log(`✅ ${Object.keys(createdCategories).length} Categories created.`);

  // 4. Create 42 Products across Categories
  const productsList = [
    // --- Category: Microcontroladores & IoT ---
    {
      name: 'ESP32-WROOM-32D Wi-Fi & Bluetooth MCU',
      slug: 'esp32-wroom-32d-wifi-bluetooth',
      description: 'Módulo microcontrolador dual-core de 240MHz con conectividad Wi-Fi 802.11 b/g/n y Bluetooth 4.2. Ideal para IoT.',
      price: 6.99,
      stock: 45,
      sku: 'MCU-ESP32-WROOM',
      categoryId: createdCategories['microcontroladores-iot'],
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
      featured: true,
      specifications: { "Frecuencia": "240 MHz Dual Core", "SRAM": "520 KB", "Flash": "4 MB", "Voltaje": "3.3V" }
    },
    {
      name: 'Arduino Uno R4 WiFi Core Board',
      slug: 'arduino-uno-r4-wifi',
      description: 'Procesador ARM Cortex-M4 de 32 bits RA4M1 con matriz LED 12x8 integrada y módulo ESP32-S3 para Wi-Fi/BLE.',
      price: 27.50,
      stock: 18,
      sku: 'MCU-ARD-UNOR4',
      categoryId: createdCategories['microcontroladores-iot'],
      image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80',
      featured: true,
      specifications: { "Procesador": "Renesas RA4M1", "Matriz LED": "12x8 Integrada", "Voltaje": "5V" }
    },
    {
      name: 'Raspberry Pi Pico W con Wi-Fi',
      slug: 'raspberry-pi-pico-w',
      description: 'Placa microcontroladora de bajo coste basada en el chip RP2040 con módulo inalámbrico Infineon CYW43439.',
      price: 7.25,
      stock: 60,
      sku: 'MCU-RPI-PICOW',
      categoryId: createdCategories['microcontroladores-iot'],
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: { "Chip": "RP2040 Dual ARM Cortex M0+", "SRAM": "264 KB", "Flash": "2 MB" }
    },
    {
      name: 'STM32F401CDU6 Black Pill 84MHz',
      slug: 'stm32f401cdu6-black-pill',
      description: 'Placa de desarrollo potente ARM Cortex-M4 con 512KB Flash, USB Type-C y frecuencia de reloj de 84MHz.',
      price: 8.50,
      stock: 30,
      sku: 'MCU-STM32-BLACKPILL',
      categoryId: createdCategories['microcontroladores-iot'],
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: { "Núcleo": "ARM Cortex-M4 FPU", "Clock": "84 MHz", "Flash": "512 KB" }
    },
    {
      name: 'ESP8266 NodeMCU V3 ESP-12E',
      slug: 'esp8266-nodemcu-v3',
      description: 'Módulo IoT económico con chip Wi-Fi integrado, ideal para proyectos simples de sensorización remota.',
      price: 4.80,
      stock: 50,
      sku: 'MCU-ESP8266-NODEMCU',
      categoryId: createdCategories['microcontroladores-iot'],
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: { "Wi-Fi": "802.11 b/g/n", "USB-UART": "CH340G", "GPIO": "10 Pines" }
    },
    {
      name: 'Arduino Nano Every con Pines',
      slug: 'arduino-nano-every',
      description: 'Evolución compacta del clásico Arduino Nano impulsado por el microcontrolador ATMega4809 a 20MHz.',
      price: 13.90,
      stock: 25,
      sku: 'MCU-ARD-NANOEVERY',
      categoryId: createdCategories['microcontroladores-iot'],
      image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: { "MCU": "ATMega4809", "Clock": "20 MHz", "Flash": "48 KB" }
    },

    // --- Category: Placas Base & SBC ---
    {
      name: 'Raspberry Pi 5 - 8GB RAM SBC',
      slug: 'raspberry-pi-5-8gb-ram',
      description: 'Procesador Quad-Core 64-bit Arm Cortex-A76 a 2.4GHz, GPU VideoCore VII, PCIe 2.0 y soporte dual 4K60.',
      price: 89.99,
      stock: 8,
      sku: 'SBC-RPI5-8GB',
      categoryId: createdCategories['placas-base-sbc'],
      image: 'https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600&auto=format&fit=crop&q=80',
      featured: true,
      specifications: { "CPU": "Broadcom BCM2712 Quad-Core 2.4GHz", "RAM": "8GB LPDDR4X", "Video": "Dual micro-HDMI 4K" }
    },
    {
      name: 'Raspberry Pi 4 Model B - 4GB RAM',
      slug: 'raspberry-pi-4-model-b-4gb',
      description: 'Ordenador de placa reducida Quad Core 1.5GHz 64 bits con puertos Gigabit Ethernet, USB 3.0 y Wi-Fi 5.',
      price: 65.00,
      stock: 14,
      sku: 'SBC-RPI4-4GB',
      categoryId: createdCategories['placas-base-sbc'],
      image: 'https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: { "CPU": "Broadcom BCM2711 1.5GHz", "RAM": "4GB LPDDR4", "Ethernet": "Gigabit Real" }
    },
    {
      name: 'NVIDIA Jetson Orin Nano Developer Kit 8GB',
      slug: 'nvidia-jetson-orin-nano-8gb',
      description: 'Superordenador compacto para IA en el borde con 40 TOPS de rendimiento de Inteligencia Artificial.',
      price: 499.00,
      stock: 4,
      sku: 'SBC-NV-JETSON-ORIN',
      categoryId: createdCategories['placas-base-sbc'],
      image: 'https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600&auto=format&fit=crop&q=80',
      featured: true,
      specifications: { "Rendimiento IA": "40 TOPS", "GPU": "NVIDIA Ampere 1024 Cores", "RAM": "8GB LPDDR5" }
    },
    {
      name: 'Orange Pi 5 Plus 16GB LPDDR4X',
      slug: 'orange-pi-5-plus-16gb',
      description: 'Potente SBC con chip RK3588 Octa-Core 64-bit, doble puerto 2.5G Ethernet y ranura NVMe M.2 2280.',
      price: 145.00,
      stock: 6,
      sku: 'SBC-OPI5-PLUS-16GB',
      categoryId: createdCategories['placas-base-sbc'],
      image: 'https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: { "SOC": "Rockchip RK3588 Octa-Core", "RAM": "16GB LPDDR4X", "Ethernet": "2x 2.5 Gbps" }
    },
    {
      name: 'Radxa ZERO 3W 2GB RAM LPDDR4',
      slug: 'radxa-zero-3w-2gb',
      description: 'Placa ultra-compacta formato Zero con SoC Quad-Core Cortex-A55 RK3566 y conectividad Wi-Fi 5 / Bluetooth 5.0.',
      price: 29.99,
      stock: 22,
      sku: 'SBC-RADXA-ZERO3W',
      categoryId: createdCategories['placas-base-sbc'],
      image: 'https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: { "Formato": "Zero Slim", "CPU": "RK3566 Quad-Core 1.8GHz", "RAM": "2GB LPDDR4" }
    },
    {
      name: 'Banana Pi BPI-M5 Amlogic S905X3 4GB',
      slug: 'banana-pi-bpi-m5-4gb',
      description: 'SBC alternativa con procesador Quad-Core Amlogic S905X3 y almacenamiento eMMC de 16GB en placa.',
      price: 58.00,
      stock: 10,
      sku: 'SBC-BPI-M5-4GB',
      categoryId: createdCategories['placas-base-sbc'],
      image: 'https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: { "CPU": "Amlogic S905X3 Quad Core", "RAM": "4GB", "eMMC": "16GB Integrado" }
    },

    // --- Category: Módulos & Sensores ---
    {
      name: 'Módulo Pantalla OLED I2C 0.96 Pulgadas SSD1306',
      slug: 'modulo-pantalla-oled-i2c-096-ssd1306',
      description: 'Pantalla gráfica OLED de 128x64 píxeles azul con interfaz I2C. Consumo ultra bajo y excelente contraste.',
      price: 4.50,
      stock: 35,
      sku: 'MOD-OLED-096I2C',
      categoryId: createdCategories['modulos-sensores'],
      image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80',
      featured: true,
      specifications: { "Resolución": "128 x 64 Píxeles", "Controlador": "SSD1306", "Interfaz": "I2C" }
    },
    {
      name: 'Sensor Digital Temperatura y Humedad DHT22 (AM2302)',
      slug: 'sensor-temperatura-humedad-dht22',
      description: 'Sensor capacitivo de alta precisión para medir temperatura (-40 a +80 °C) y humedad (0 a 100% RH).',
      price: 5.80,
      stock: 5,
      sku: 'SNS-DHT22-DIG',
      categoryId: createdCategories['modulos-sensores'],
      image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: { "Rango Temp": "-40 a 80 °C", "Precisión": "±0.5 °C", "Rango Humedad": "0-100% RH" }
    },
    {
      name: 'Kit Módulo Relevador 4 Canales 5V Optoacoplado',
      slug: 'kit-modulo-relevador-4-canales-5v',
      description: 'Módulo de 4 relés mecánicos de 5V aislamiento optoacoplado para conmutación de hasta 250V / 10A AC.',
      price: 8.90,
      stock: 22,
      sku: 'MOD-RELAY-4CH',
      categoryId: createdCategories['modulos-sensores'],
      image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: { "Canales": "4 Relés", "Max Carga AC": "250V / 10A", "Optoaislado": "Sí" }
    },
    {
      name: 'Sensor de Distancia Ultrasónico HC-SR04',
      slug: 'sensor-ultrasonico-hc-sr04',
      description: 'Sensor de medición de distancia sin contacto de 2cm a 400cm con precisión de 3mm.',
      price: 2.50,
      stock: 80,
      sku: 'SNS-HC-SR04',
      categoryId: createdCategories['modulos-sensores'],
      image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: { "Rango": "2 cm - 400 cm", "Ángulo": "< 15 grados", "Frecuencia": "40 kHz" }
    },
    {
      name: 'Sensor de Ritmo Cardíaco y Pulsoximetría MAX30102',
      slug: 'sensor-pulso-max30102',
      description: 'Módulo sensor biométrico I2C para medición de frecuencia cardíaca y saturación de oxígeno SpO2.',
      price: 6.20,
      stock: 19,
      sku: 'SNS-MAX30102-BIO',
      categoryId: createdCategories['modulos-sensores'],
      image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80',
      featured: true,
      specifications: { "Medición": "SpO2 y Pulso", "Interfaz": "I2C", "LEDs": "Infrarrojo y Rojo" }
    },
    {
      name: 'Módulo Cámara Arducam 5MP OV5647 para Raspberry Pi',
      slug: 'camara-arducam-5mp-ov5647-rpi',
      description: 'Sensor de cámara de 5 megapíxeles con cable plano MIPI CSI compatible con Raspberry Pi 3, 4 y 5.',
      price: 12.50,
      stock: 15,
      sku: 'MOD-CAM-OV5647',
      categoryId: createdCategories['modulos-sensores'],
      image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: { "Resolución": "5 MP (2592 x 1944)", "Conector": "CSI Ribbon", "Video": "1080p 30fps" }
    },

    // --- Category: Herramientas de laboratorio ---
    {
      name: 'Estación de Soldar Inteligente TS101 OLED 65W PD',
      slug: 'estacion-de-soldar-ts101-oled-65w',
      description: 'Soldador tipo cautín portátil con alimentación USB Type-C PD 65W y calentamiento en 9 segundos.',
      price: 64.90,
      stock: 12,
      sku: 'TL-SOLD-TS101',
      categoryId: createdCategories['herramientas-laboratorio'],
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      featured: true,
      specifications: { "Potencia": "65W USB-PD", "Rango Temp": "100°C - 400°C", "Pantalla": "OLED" }
    },
    {
      name: 'Multímetro Digital Autorango RMS Verdadero 6000 Cuentas',
      slug: 'multimetro-digital-autorango-true-rms',
      description: 'Instrumento de medición profesional True RMS con detector de voltaje sin contacto NCV y capacitancia.',
      price: 34.00,
      stock: 4,
      sku: 'TL-MULTI-TRMS6K',
      categoryId: createdCategories['herramientas-laboratorio'],
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: { "Cuentas": "6000 True RMS", "Seguridad": "CAT III 600V", "Funciones": "NCV, Hz, Temp, F" }
    },
    {
      name: 'Osciloscopio Digital Portátil FNIRSI 1014D Dual 100MHz',
      slug: 'osciloscopio-fnirsi-1014d-dual-100mhz',
      description: 'Osciloscopio de laboratorio de 2 canales con ancho de banda de 100MHz, tasa de muestreo 1GSa/s y pantalla de 7".',
      price: 189.00,
      stock: 5,
      sku: 'TL-OSC-1014D-100M',
      categoryId: createdCategories['herramientas-laboratorio'],
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      featured: true,
      specifications: { "Canales": "2 Canales", "Ancho de Banda": "100 MHz", "Muestreo": "1 GSa/s", "Pantalla": "7 Pulgadas TFT" }
    },
    {
      name: 'Fuente de Alimentación Regulable DC 30V 10A LED',
      slug: 'fuente-alimentacion-dc-30v-10a-led',
      description: 'Fuente de poder lineal de alta precisión con display digital de voltaje, corriente y perillas de ajuste fino.',
      price: 79.90,
      stock: 9,
      sku: 'TL-PSU-30V10A',
      categoryId: createdCategories['herramientas-laboratorio'],
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: { "Salida Voltaje": "0 - 30V DC", "Salida Corriente": "0 - 10A", "Protección": "OCP, OVP, OTP" }
    },
    {
      name: 'Generador de Funciones DDS Signal Generator 15MHz',
      slug: 'generador-funciones-dds-15mhz',
      description: 'Generador de formas de onda senoidal, cuadrada, triangular y pulso de dos canales independientes.',
      price: 95.00,
      stock: 7,
      sku: 'TL-GEN-DDS15M',
      categoryId: createdCategories['herramientas-laboratorio'],
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: { "Frecuencia Máx": "15 MHz", "Formas de Onda": "Seno, Cuadrada, Triángulo, Rampa", "Canales": "2 CH" }
    },
    {
      name: 'Estación de Aire Caliente para Desoldado SMD 700W',
      slug: 'estacion-aire-caliente-smd-700w',
      description: 'Estación de retrabajo con turbina de aire en mango, regulación digital de flujo de aire y temperatura hasta 480°C.',
      price: 88.50,
      stock: 8,
      sku: 'TL-HOTAIR-700W',
      categoryId: createdCategories['herramientas-laboratorio'],
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: { "Potencia": "700W", "Temperatura": "100°C - 480°C", "Flujo Aire": "120L/min Máx" }
    },

    // --- Category: Robótica & Motores ---
    {
      name: 'Servomotor Digital MG996R Torque Metálico 13kg',
      slug: 'servomotor-digital-mg996r-13kg',
      description: 'Servo estándar con piñonería de metal de alto par (13 kg/cm a 6V) ideal para brazos robóticos y modelismo.',
      price: 7.99,
      stock: 40,
      sku: 'ROB-SRV-MG996R',
      categoryId: createdCategories['robotica-motores'],
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
      featured: true,
      specifications: { "Torque": "13 kg/cm (6V)", "Engranajes": "Metálicos", "Rotación": "180 Grados" }
    },
    {
      name: 'Motor Paso a Paso NEMA 17 1.8° 4.2kg.cm',
      slug: 'motor-paso-a-paso-nema-17-42kgcm',
      description: 'Motor bipolar de precisión para impresoras 3D, routers CNC y plataformas de movimiento robótico.',
      price: 14.50,
      stock: 26,
      sku: 'ROB-STEP-NEMA17',
      categoryId: createdCategories['robotica-motores'],
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: { "Ángulo Paso": "1.8° (200 pasos/rev)", "Corriente": "1.5A", "Torque": "42 N.cm" }
    },
    {
      name: 'Driver de Motores Puente H L298N Dual',
      slug: 'driver-motores-puente-h-l298n',
      description: 'Módulo puente H para control de sentido y velocidad PWM de hasta 2 motores DC o 1 motor paso a paso.',
      price: 3.90,
      stock: 55,
      sku: 'ROB-DRV-L298N',
      categoryId: createdCategories['robotica-motores'],
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: { "Voltaje Motor": "5V - 35V", "Corriente Pico": "2A por canal", "Chip": "L298N Dual H-Bridge" }
    },
    {
      name: 'Chasis Robótico Carro 2WD con Ruedas y Encoder',
      slug: 'chasis-robotico-carro-2wd',
      description: 'Kit de plataforma de acrílico con 2 motores con reductora 1:48, ruedas de goma y discos de encoder óptico.',
      price: 13.90,
      stock: 18,
      sku: 'ROB-KIT-2WD-CAR',
      categoryId: createdCategories['robotica-motores'],
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
      featured: true,
      specifications: { "Tracción": "2WD Ruedas traseras + Rueda loca", "Alimentación": "4x Pilas AA", "Velocidad": "20m/min" }
    },
    {
      name: 'Controlador de Servos PCA9685 16 Canales PWM I2C',
      slug: 'controlador-servos-pca9685-16ch',
      description: 'Placa de expansión I2C de 12 bits de resolución para manejar hasta 16 servomotores simultáneamente.',
      price: 6.80,
      stock: 30,
      sku: 'ROB-DRV-PCA9685',
      categoryId: createdCategories['robotica-motores'],
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: { "Canales": "16 Salidas PWM", "Resolución": "12 Bits", "Comunicación": "I2C" }
    },
    {
      name: 'Micro Servomotor SG90 9g 1.8kg',
      slug: 'micro-servomotor-sg90-9g',
      description: 'Servo ultraligero de 9 gramos para pequeños prototipos, aviones RC y proyectos escolares.',
      price: 2.20,
      stock: 90,
      sku: 'ROB-SRV-SG90',
      categoryId: createdCategories['robotica-motores'],
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: { "Peso": "9 Gramos", "Torque": "1.8 kg/cm", "Velocidad": "0.12 seg/60°" }
    },

    // --- Category: Fuentes de Alimentación & Baterías ---
    {
      name: 'Convertidor DC-DC Buck Step-Down LM2596 3A',
      slug: 'convertidor-dcdc-buck-lm2596-3a',
      description: 'Módulo reductor de voltaje eficiente de entrada 4.5-40V a salida regulable 1.25-35V hasta 3 Amperios.',
      price: 2.10,
      stock: 75,
      sku: 'PWR-BUCK-LM2596',
      categoryId: createdCategories['fuentes-alimentacion-baterias'],
      image: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: { "Eficiencia": "Hasta 92%", "Voltaje Entrada": "4.5V - 40V", "Voltaje Salida": "1.25V - 35V Regulable" }
    },
    {
      name: 'Batería Recargable Li-ion 18650 3.7V 3000mAh NCR18650B',
      slug: 'bateria-liion-18650-37v-3000mah',
      description: 'Celda de litio de alta capacidad nominal 3000mAh para linternas, robótica y packs de baterías.',
      price: 6.50,
      stock: 60,
      sku: 'PWR-BAT-18650-3K',
      categoryId: createdCategories['fuentes-alimentacion-baterias'],
      image: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?w=600&auto=format&fit=crop&q=80',
      featured: true,
      specifications: { "Capacidad": "3000 mAh", "Voltaje Nominal": "3.7V", "Química": "Li-ion NCR" }
    },
    {
      name: 'Módulo Cargador Batería LiPo TP4056 USB Type-C con Protección',
      slug: 'modulo-cargador-tpb4056-usb-c-proteccion',
      description: 'Placa de carga de celda de litio 1S (3.7V) a 1A con circuito de protección DW01 contra sobrecarga y sobredescarga.',
      price: 1.50,
      stock: 110,
      sku: 'PWR-CHG-TP4056-USBC',
      categoryId: createdCategories['fuentes-alimentacion-baterias'],
      image: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: { "Corriente Carga": "1A Regulable", "Conector": "USB Type-C", "Protección": "DW01 + 8205A" }
    },
    {
      name: 'Fuente Conmutada Industrial 12V 10A 120W Metal',
      slug: 'fuente-conmutada-industrial-12v-10a',
      description: 'Fuente de poder encapsulada en aluminio perforado para tiras LED, cámaras CCTV y proyectos de potencia.',
      price: 19.90,
      stock: 14,
      sku: 'PWR-PSU-12V10A',
      categoryId: createdCategories['fuentes-alimentacion-baterias'],
      image: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: { "Voltaje Salida": "12V DC", "Corriente": "10A", "Potencia": "120 Watts" }
    },
    {
      name: 'Módulo Elevador DC-DC Boost XL6009 4A',
      slug: 'modulo-elevador-dcdc-boost-xl6009',
      description: 'Convertidor elevador de voltaje de alta frecuencia de entrada 3-32V a salida elevable 5-35V.',
      price: 2.80,
      stock: 40,
      sku: 'PWR-BOOST-XL6009',
      categoryId: createdCategories['fuentes-alimentacion-baterias'],
      image: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: { "Frecuencia": "400 kHz", "Voltaje Entrada": "3V - 32V", "Voltaje Salida": "5V - 35V" }
    },
    {
      name: 'BMS 3S 20A 12.6V Módulo de Protección Baterías Litio',
      slug: 'bms-3s-20a-126v-proteccion-baterias',
      description: 'Placa de balanceo y protección para 3 celdas Li-ion 18650 en serie con corte por sobrecorriente.',
      price: 3.50,
      stock: 35,
      sku: 'PWR-BMS-3S20A',
      categoryId: createdCategories['fuentes-alimentacion-baterias'],
      image: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: { "Configuración": "3S (11.1V / 12.6V)", "Corriente Máxima": "20A", "Protección Corto": "Sí" }
    },

    // --- Category: Componentes Pasivos & Semiconductores ---
    {
      name: 'Kit de 600 Resistencias Película de Carbón 1/4W (30 Valores)',
      slug: 'kit-resistencias-600pcs-30valores',
      description: 'Surtido completo de resistencias de 1/4 watt tolerancia 1% desde 10 Ohmios hasta 1 Megaohmio.',
      price: 8.90,
      stock: 50,
      sku: 'CMP-RES-KIT600',
      categoryId: createdCategories['componentes-pasivos-semiconductores'],
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&auto=format&fit=crop&q=80',
      featured: true,
      specifications: { "Cantidad": "600 Piezas", "Tolerancia": "±1%", "Valores": "30 Variedades" }
    },
    {
      name: 'Kit 120 Condensadores Electrolíticos Aluminio (12 Valores)',
      slug: 'kit-condensadores-electroliticos-120pcs',
      description: 'Caja organizadora con capacitores electrolíticos de 1uF a 470uF a voltajes de 16V a 50V.',
      price: 7.50,
      stock: 32,
      sku: 'CMP-CAP-KIT120',
      categoryId: createdCategories['componentes-pasivos-semiconductores'],
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: { "Cantidad": "120 Piezas", "Capacidad": "1uF a 470uF", "Voltajes": "16V / 25V / 50V" }
    },
    {
      name: 'Pack 50 Diodos Rectificadores 1N4007 1A 1000V',
      slug: 'pack-50-diodos-1n4007',
      description: 'Diodos de rectificación estándar de silicio 1 Ampere 1000 Volts en encapsulado DO-41.',
      price: 2.20,
      stock: 120,
      sku: 'CMP-DIO-1N4007-50P',
      categoryId: createdCategories['componentes-pasivos-semiconductores'],
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: { "Corriente Max": "1 Ampere", "Voltaje Inverso": "1000 Volts", "Encapsulado": "DO-41" }
    },
    {
      name: 'Pack 20 Transistores NPN 2N2222A TO-92',
      slug: 'pack-20-transistores-npn-2n2222a',
      description: 'Transistores bipolares NPN de conmutación rápida y amplificación de señal en encapsulado TO-92.',
      price: 3.10,
      stock: 85,
      sku: 'CMP-TR-2N2222A-20P',
      categoryId: createdCategories['componentes-pasivos-semiconductores'],
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: { "Tipo": "NPN BJT", "Corriente Colector": "800 mA", "Voltaje Vceo": "40V" }
    },
    {
      name: 'Circuito Integrado Temporizador NE555P (DIP-8 Pack 10)',
      slug: 'circuito-integrado-ne555p-dip8-10pack',
      description: 'Ic cronometrador de precisión multivibrador monoestable y astable clásico en empaque DIP de 8 pines.',
      price: 3.80,
      stock: 70,
      sku: 'CMP-IC-NE555-10P',
      categoryId: createdCategories['componentes-pasivos-semiconductores'],
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&auto=format&fit=crop&q=80',
      featured: false,
      specifications: { "Empaque": "DIP-8", "Voltaje Trabajo": "4.5V - 16V", "Frecuencia": "Hasta 500 kHz" }
    },
    {
      name: 'Kit 300 LEDs Difusos 5mm (5 Colores x 60 Pcs)',
      slug: 'kit-300-leds-difusos-5mm-5colores',
      description: 'Kit de diodos emisores de luz de 5mm en colores Rojo, Verde, Azul, Amarillo y Blanco.',
      price: 6.90,
      stock: 45,
      sku: 'CMP-LED-KIT300',
      categoryId: createdCategories['componentes-pasivos-semiconductores'],
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&auto=format&fit=crop&q=80',
      featured: true,
      specifications: { "Diámetro": "5 mm", "Colores": "Red, Green, Blue, Yellow, White", "Cantidad": "300 pcs" }
    }
  ];

  const createdProducts = [];
  for (const p of productsList) {
    const prod = await prisma.product.create({ data: p });
    createdProducts.push(prod);
  }

  console.log(`✅ ${createdProducts.length} Total Products created across all categories.`);

  // 5. Create Sample Orders for reporting and charts
  const ordersData = [
    {
      orderNumber: 'ORD-202607-1001',
      userId: createdCustomers[0].id, // Carlos Ruiz
      status: 'DELIVERED',
      totalAmount: 124.48,
      shippingAddress: 'Av. Libertador #450, Santiago',
      paymentMethod: 'CREDIT_CARD',
      createdAt: new Date(Date.now() - 86400000 * 14),
      items: [
        { productId: createdProducts[6].id, quantity: 1, unitPrice: 89.99, totalPrice: 89.99 }, // RPi 5
        { productId: createdProducts[1].id, quantity: 1, unitPrice: 27.50, totalPrice: 27.50 }, // Arduino Uno R4
        { productId: createdProducts[0].id, quantity: 1, unitPrice: 6.99, totalPrice: 6.99 }    // ESP32
      ]
    },
    {
      orderNumber: 'ORD-202607-1002',
      userId: createdCustomers[1].id, // Maria Gonzalez
      status: 'PAID',
      totalAmount: 78.30,
      shippingAddress: 'Calle San Martín 102, Depto 4B',
      paymentMethod: 'PAYPAL',
      createdAt: new Date(Date.now() - 86400000 * 10),
      items: [
        { productId: createdProducts[18].id, quantity: 1, unitPrice: 64.90, totalPrice: 64.90 }, // Soldador TS101
        { productId: createdProducts[2].id, quantity: 1, unitPrice: 7.25, totalPrice: 7.25 },   // Pico W
        { productId: createdProducts[13].id, quantity: 1, unitPrice: 5.80, totalPrice: 5.80 }   // Sensor DHT22
      ]
    },
    {
      orderNumber: 'ORD-202607-1003',
      userId: createdCustomers[2].id, // Juan Perez
      status: 'SHIPPED',
      totalAmount: 189.00,
      shippingAddress: 'Pasaje Los Olivos #890, Valparaíso',
      paymentMethod: 'DEBIT_CARD',
      createdAt: new Date(Date.now() - 86400000 * 7),
      items: [
        { productId: createdProducts[20].id, quantity: 1, unitPrice: 189.00, totalPrice: 189.00 } // Osciloscopio FNIRSI
      ]
    },
    {
      orderNumber: 'ORD-202607-1004',
      userId: createdCustomers[3].id, // Ana Martinez
      status: 'DELIVERED',
      totalAmount: 499.00,
      shippingAddress: 'Av. Providencia #2100, Oficina 502',
      paymentMethod: 'CREDIT_CARD',
      createdAt: new Date(Date.now() - 86400000 * 5),
      items: [
        { productId: createdProducts[8].id, quantity: 1, unitPrice: 499.00, totalPrice: 499.00 } // Jetson Orin
      ]
    },
    {
      orderNumber: 'ORD-202607-1005',
      userId: createdCustomers[4].id, // Lucia Fernandez
      status: 'PENDING',
      totalAmount: 45.30,
      shippingAddress: 'Calle Prat #340, Concepción',
      paymentMethod: 'TRANSFER',
      createdAt: new Date(Date.now() - 86400000 * 2),
      items: [
        { productId: createdProducts[24].id, quantity: 2, unitPrice: 7.99, totalPrice: 15.98 },  // Servo MG996R x2
        { productId: createdProducts[27].id, quantity: 1, unitPrice: 13.90, totalPrice: 13.90 }, // Chasis 2WD
        { productId: createdProducts[26].id, quantity: 2, unitPrice: 3.90, totalPrice: 7.80 },   // Driver L298N x2
        { productId: createdProducts[31].id, quantity: 3, unitPrice: 2.50, totalPrice: 7.50 }    // Sensor Ultrasónico
      ]
    },
    {
      orderNumber: 'ORD-202607-1006',
      userId: createdCustomers[5].id, // Roberto Silva
      status: 'PAID',
      totalAmount: 312.80,
      shippingAddress: 'Camino Industrial #77, Antofagasta',
      paymentMethod: 'CREDIT_CARD',
      createdAt: new Date(Date.now() - 86400000 * 1),
      items: [
        { productId: createdProducts[9].id, quantity: 2, unitPrice: 145.00, totalPrice: 290.00 }, // Orange Pi 5 Plus x2
        { productId: createdProducts[36].id, quantity: 1, unitPrice: 19.90, totalPrice: 19.90 },  // Fuente 12V 10A
        { productId: createdProducts[34].id, quantity: 1, unitPrice: 2.90, totalPrice: 2.90 }     // Convertidor Buck
      ]
    }
  ];

  for (const o of ordersData) {
    const { items, ...orderInfo } = o;
    await prisma.order.create({
      data: {
        ...orderInfo,
        items: {
          create: items
        }
      }
    });
  }

  console.log(`✅ ${ordersData.length} Sample Orders created.`);
  console.log('🚀 Database seeding finished successfully!');
}

seed()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

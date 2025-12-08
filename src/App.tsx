import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  RefreshCw,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Box,
  Layers,
  MoveVertical,
  Activity,
  Clipboard,
  Calculator,
  Users,
  Building,
  HelpCircle,
  LayoutDashboard,
  Plus,
  Search,
  MoreVertical,
  Trash2,
  Edit3,
  MessageSquare,
  Phone,
  Mail,
  Send,
  Smartphone,
  X,
  Shield,
  Key,
  Database,
  UserPlus,
  Lock,
  Globe,
  Package,
  Wrench,
  WifiOff, // Icono sin conexión
} from 'lucide-react';

// --- MOCK DATA & CONSTANTS ---

const ELEVATOR_MODELS = [
  { id: 'MR', label: 'Con cuarto de máquinas (MR)' },
  { id: 'MRL-L', label: 'Sin cuarto de máquinas (MRL-L)' },
  { id: 'MRL-G', label: 'Sin cuarto de máquinas (MRL-G)' },
  { id: 'HYD', label: 'Hidráulico (HyD)' },
  { id: 'PLAT', label: 'Plataforma' },
  { id: 'CAR', label: 'Apila Autos' },
];

const SPEEDS = [
  '0.6',
  '1.0',
  '1.6',
  '1.75',
  '2.0',
  '2.5',
  '3.0',
  '4.0',
  '5.0',
  '6.0',
];
const CAPACITIES = [
  100, 320, 450, 630, 800, 1000, 1250, 1600, 2000, 2500, 3000, 4000, 5000,
];
const CONTROL_GROUPS = ['Simplex', 'Duplex', 'Triplex', 'Cuadruplex', 'Mixto'];
const TRACTIONS = ['1:1', '2:1', '4:1'];
const CABIN_MODELS = [
  { id: 'ASC', label: 'ASC Estándar' },
  { id: 'APNSC01', label: 'APNSC01 (1 Pared Cristal)' },
  { id: 'APNSC02', label: 'APNSC02 (2 Paredes Cristal)' },
  { id: 'APNSC03', label: 'APNSC03 (3 Paredes Cristal)' },
  { id: 'APNRC00', label: 'APNRC00 (Redonda Panorámica)' },
  { id: 'APNMC00', label: 'APNMC00 (Hexagonal Panorámica)' },
  { id: 'ACC', label: 'ACC (Carga)' },
  { id: 'CLX124', label: 'CLX124 (Hospital)' },
];
const FLOOR_FINISHES = ['Granito', 'PVC', 'Aluminio', 'Metal', '3D Design'];
const NORMS = ['EN 81-1', 'EN 81-2', 'NOM-053', 'ASME A17.1'];

const MOCK_SAVED_QUOTES = [
  {
    id: 101,
    client: 'Desarrolladora Vertical',
    phone: '5512345678',
    email: 'contacto@vertical.com',
    ref: 'Torre Reforma - Elev 1',
    date: '2023-10-15',
    model: 'MRL-G',
    status: 'Sincronizado',
    total: 2,
  },
  {
    id: 102,
    client: 'Hospital Santa Fe',
    phone: '5587654321',
    email: 'compras@santafe.com',
    ref: 'Camillero Urgencias',
    date: '2023-10-20',
    model: 'CLX124',
    status: 'Borrador',
    total: 1,
  },
];

const MOCK_CHATS = [
  {
    id: 1,
    name: 'Desarrolladora Vertical',
    lastMsg: '¿Me puedes confirmar el tiempo de entrega?',
    time: '10:30 AM',
    unread: 2,
    history: [
      { sender: 'me', text: 'Hola, te adjunto la propuesta SO1234.' },
      { sender: 'them', text: 'Gracias, la reviso.' },
      { sender: 'them', text: '¿Me puedes confirmar el tiempo de entrega?' },
    ],
  },
];

const MOCK_USERS = [
  {
    id: 1,
    name: 'Admin Principal',
    email: 'admin@alamex.com',
    role: 'Administrador',
    status: 'Activo',
    lastLogin: 'Hace 5 min',
  },
  {
    id: 2,
    name: 'Juan Vendedor',
    email: 'juan@alamex.com',
    role: 'Ventas',
    status: 'Activo',
    lastLogin: 'Hace 2 horas',
  },
];

// --- DATOS DE LISTA DE MATERIALES DETALLADA (BOM) ---
const INITIAL_MATERIALS = {
  'Machine Room': [
    {
      id: 'mr1',
      product: 'Control',
      desc: 'Control Inteligente Alamex MRL, 220V. / 45 A. - 11 Kw.',
      qty: 1,
      unit: 'PZA',
    },
    {
      id: 'mr2',
      product: 'Máquina / Bomba',
      desc: '[04-MAQ-GLS-11KW-AGM-AK3] Máquina Gearless 1,000 Kg 11.0 Kw',
      qty: 1,
      unit: 'PZA',
    },
    { id: 'mr3', product: 'Pistón', desc: 'NO APLICA', qty: 0, unit: 'PZA' },
    {
      id: 'mr4',
      product: 'Bancada',
      desc: 'Incluido en el Kit de Chasis MRL-G',
      qty: 1,
      unit: 'PZA',
    },
    {
      id: 'mr5',
      product: 'Cable Tablero/máquina',
      desc: '[CM4x10] Cable de Motor Multi Conducto 4x10 + 4x1.5',
      qty: 7,
      unit: 'm.',
    },
    {
      id: 'mr6',
      product: 'Regulador de Velocidad',
      desc: '[04-REG-POB-1.6/30] Regulador MRL 1.6 m/s',
      qty: 1,
      unit: 'PZA',
    },
  ],
  'Pit (Fosa)': [
    {
      id: 'pt1',
      product: 'Amortiguador de Fosa',
      desc: '[02-AMO-ALAM-001-00] Amortiguador ALAM 01',
      qty: 2,
      unit: 'PZA',
    },
    {
      id: 'pt2',
      product: 'Bancada Amortiguador',
      desc: '[ARMB-AA] Bancada Ajustable para Amortiguador',
      qty: 2,
      unit: 'PZA',
    },
    {
      id: 'pt3',
      product: 'Recolector de aceite',
      desc: '[02-REC-ACE-0001] Recolector De Aceite',
      qty: 4,
      unit: 'PZA',
    },
    {
      id: 'pt4',
      product: 'Escalera',
      desc: '[ARME-F] Escalera para Fosa',
      qty: 1,
      unit: 'PZA',
    },
    {
      id: 'pt5',
      product: 'Stop de Fosa',
      desc: '[04-BOT-STP-MEC-00001] Botón Stop Con Seguro Mecánico',
      qty: 1,
      unit: 'PZA',
    },
  ],
  'Guides (Guías)': [
    {
      id: 'gd1',
      product: 'Kit de riel de cabina',
      desc: '[ARMK-R16] Kit De Riel 16 mm 90x75x16 mm T90',
      qty: 12,
      unit: 'PZA',
    },
    {
      id: 'gd2',
      product: 'Kit de riel de contrapeso',
      desc: '[ARMK-R5] Kit de Riel 5 mm 50x50x5 mm T50',
      qty: 12,
      unit: 'PZA',
    },
    {
      id: 'gd3',
      product: 'Grapas Cabina',
      desc: '[02-GPR-M03-0016] Grapas Modelo 3 Para 16 mm',
      qty: 96,
      unit: 'PZA',
    },
    {
      id: 'gd4',
      product: 'Grapas Contrapeso',
      desc: '[02-GRP-M01-0005] Grapas Modelo 1 Para 5 mm',
      qty: 96,
      unit: 'PZA',
    },
    {
      id: 'gd5',
      product: 'Soporte Cabina',
      desc: '[ARMS-2000] Soporte 2000 Contra Peso Alado Grande',
      qty: 19,
      unit: 'PZA',
    },
  ],
  'Cabin (Cabina)': [
    {
      id: 'cb1',
      product: 'Cabina',
      desc: '[04-ASC-CLX102B] Cabina Inox 304 mate, medio espejo, 1000 Kg',
      qty: 1,
      unit: 'PZA',
    },
    {
      id: 'cb2',
      product: 'Chasis de cabina',
      desc: 'Kit MRL/G 2 Alamex ajustable 1000 Kg.',
      qty: 1,
      unit: 'PZA',
    },
    {
      id: 'cb3',
      product: 'COP',
      desc: '[01-COP-CCAI] COP Serial para Control Alamex Inteligente',
      qty: 1,
      unit: 'PZA',
    },
    {
      id: 'cb4',
      product: 'Operador de puerta',
      desc: '[04-2CC-CLX101] Puerta Cabina Inox Mate, 2 hojas, central',
      qty: 1,
      unit: 'PZA',
    },
    {
      id: 'cb5',
      product: 'Cortina de luz',
      desc: '[01-COR-LUZ-0001] Cortina De Luz 110 a 220v.ac /24 v.dc',
      qty: 1,
      unit: 'PZA',
    },
    {
      id: 'cb6',
      product: 'Aceiteras',
      desc: '[07-ACE-BASE-0001] Aceitera Con Base',
      qty: 4,
      unit: 'PZA',
    },
    {
      id: 'cb7',
      product: 'Sensor de carga',
      desc: '[04-BAS-BDEC-350-22] Báscula debajo de la Cabina',
      qty: 1,
      unit: 'PZA',
    },
    {
      id: 'cb8',
      product: 'Paracaídas',
      desc: '[02-PAR-PRA-0916] Paracaídas Progresivo 2500 Kg',
      qty: 1,
      unit: 'PZA',
    },
    {
      id: 'cb9',
      product: 'Caja de inspección',
      desc: '[01-CAJ-INSP-ALA-IN] Caja de inspección inteligente',
      qty: 1,
      unit: 'PZA',
    },
    {
      id: 'cb10',
      product: 'Anclas Cabina',
      desc: '[02-ANC-NEG-0013] Anclas 13 mm Cable 12-13',
      qty: 10,
      unit: 'PZA',
    },
  ],
  Counterweight: [
    {
      id: 'cw1',
      product: 'Anclas contra peso',
      desc: '[02-ANC-NEG-0013] Anclas 13 mm Cable 12-13',
      qty: 10,
      unit: 'PZA',
    },
    {
      id: 'cw2',
      product: 'Marco de contra peso',
      desc: 'Marco Chasis De Contra Peso MRLG Alamex',
      qty: 1,
      unit: 'PZA',
    },
    {
      id: 'cw3',
      product: 'Contra pesos',
      desc: '[02-120-0155-760-50] Pieza de Contrapeso 50Kg',
      qty: 30,
      unit: 'PZA',
    },
  ],
  'Steel Wires': [
    {
      id: 'sw1',
      product: 'Cables de Acero',
      desc: '[02-CBL-ACE-0013] Cable de Acero 13 mm SISAL',
      qty: 638,
      unit: 'm.',
    },
    {
      id: 'sw2',
      product: 'Cable para regulador',
      desc: '[02-CBL-ACE-0006] Cable De Acero 6 mm',
      qty: 56,
      unit: 'm.',
    },
    {
      id: 'sw3',
      product: 'Pernos',
      desc: '[ARMP-HCA1/2] Perro de Hierro para Cable de 1/2',
      qty: 60,
      unit: 'PZA',
    },
    {
      id: 'sw4',
      product: 'Pernos Regulador',
      desc: '[AMRP-HCA1/4] Perro de Hierro para Cable de 1/4',
      qty: 6,
      unit: 'PZA',
    },
  ],
  'Cube (Cubo)': [
    {
      id: 'cu1',
      product: 'Cable viajero',
      desc: '[03-CBL-V40-75MM] Cable Viajero 40 x 0.75 mm.',
      qty: 30,
      unit: 'm.',
    },
    {
      id: 'cu2',
      product: 'Cargador Cable viajero',
      desc: '[02-BSE-CBL-VIAJ] Cargador De Cable Viajero',
      qty: 4,
      unit: 'PZA',
    },
    {
      id: 'cu3',
      product: 'Sensor sísmico',
      desc: '[01-SEN-SDS-S3EJ] Sensor Detector Sísmico 3Ejes',
      qty: 0,
      unit: 'PZA',
    },
    {
      id: 'cu4',
      product: 'Arnés de piso',
      desc: '[02-CBL-ECEP-04M-00] Cable de arnés para chapas 4m',
      qty: 5,
      unit: 'PZA',
    },
  ],
  'Landing (Pisos)': [
    {
      id: 'ld1',
      product: 'Puertas de piso',
      desc: '[04-2LC-CLX101] Puerta Piso Inox Mate, 2 hojas, central',
      qty: 6,
      unit: 'PZA',
    },
    {
      id: 'ld2',
      product: 'LOP 1 botón',
      desc: '[01-BOT-LOPS-INT-B1] LOP Serial Display Bajada',
      qty: 2,
      unit: 'PZA',
    },
    {
      id: 'ld3',
      product: 'LOP 2 botones',
      desc: '[01-BOT-LOPS-INT-2B] LOP Serial Display 2 Botones',
      qty: 4,
      unit: 'PZA',
    },
    {
      id: 'ld4',
      product: 'Cable LOP 10 m.',
      desc: '[03-CBL-SERI-LOP-10] Cable Serial LOP 10m',
      qty: 1,
      unit: 'PZA',
    },
    {
      id: 'ld5',
      product: 'Alarma contra incendio',
      desc: '[04-ALA-INCE-110-00] Alarma de incendios',
      qty: 1,
      unit: 'PZA',
    },
  ],
  Magnet: [
    {
      id: 'mg1',
      product: 'Imán Rectangular',
      desc: '[ARMI-R10] Imán Rectangular 10 cm',
      qty: 6,
      unit: 'PZA',
    },
    {
      id: 'mg2',
      product: 'Imán Redondo',
      desc: '[ARMI-R] Imán Redondo',
      qty: 4,
      unit: 'PZA',
    },
  ],
  Various: [
    {
      id: 'va1',
      product: 'Taquetes',
      desc: 'Kit taquete Taquete 12.7 mm (1/2) Plateado',
      qty: 66,
      unit: 'PZA',
    },
    {
      id: 'va2',
      product: 'Micros',
      desc: '[ARElS-SP-LLG] Switch Sobre Paso Llanta Grande',
      qty: 2,
      unit: 'PZA',
    },
    {
      id: 'va3',
      product: 'Gomas de cabina',
      desc: '[ARMG-DTC] Goma Doble Tornillo Para Cabina',
      qty: 8,
      unit: 'PZA',
    },
  ],
};

// --- COMPONENTS ---

export default function ElevatorQuoter() {
  // Estado Global
  const [currentView, setCurrentView] = useState('dashboard');
  const [showSettings, setShowSettings] = useState(false);

  // Estado del Cotizador
  const [activeTab, setActiveTab] = useState('project');
  const [loadingOdoo, setLoadingOdoo] = useState(false);
  const [odooStatus, setOdooStatus] = useState('disconnected');
  const [generatedQuote, setGeneratedQuote] = useState('');
  const [notification, setNotification] = useState(null);

  // Estado Dashboard / Datos
  const [savedQuotes, setSavedQuotes] = useState(MOCK_SAVED_QUOTES);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChat, setActiveChat] = useState(MOCK_CHATS[0]);

  // Estado Admin y Configuración Global
  const [users, setUsers] = useState(MOCK_USERS);
  const [globalSettings, setGlobalSettings] = useState({
    odooUrl: 'https://odoo.alamex.com',
    companyName: 'Alamex Elevadores',
    currency: 'MXN',
  });

  // Estado Formulario Cotización
  const initialFormState = {
    id: null,
    status: 'Borrador',
    // DATOS DE CONTACTO (RECUPERADOS)
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    projectDate: new Date().toISOString().split('T')[0],
    projectRef: '',
    quantity: 1,
    model: 'MRL-G',
    controlGroup: 'Simplex',
    speed: '1.0',
    traction: '1:1',
    capacity: 630,
    persons: 8,
    stops: 4,
    entrances: 'Simple',
    shaftWidth: 1800,
    shaftDepth: 1800,
    pit: 1200,
    travel: 12000,
    overhead: 4200,
    // PUERTAS Y CABINA
    doorType: 'Automática Central',
    doorWidth: 800,
    doorHeight: 2100,
    cabinFinish: 'Inox / Acero Inoxidable Mate 304',
    floorDoorFinish: 'Inox / Acero Inoxidable Mate 304',
    cabinModel: 'ASC',
    cabinFloor: 'Granito',
    // ACABADOS ADICIONALES (RECUPERADOS)
    lopModel: 'Touch',
    copModel: 'Touch',
    handrailType: 'Redondo',
    shaftType: 'Concreto',
    floorNomenclature: 'PB, 1, 2, 3...',
    fireResistance: 'No',
    norm: 'EN 81-1',
    shaftConstructionReq: 'No',
    installationReq: 'Sí',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [materialsList, setMaterialsList] = useState(INITIAL_MATERIALS);

  // Estado Tráfico
  const [trafficData, setTrafficData] = useState({
    buildingType: 'Residencial',
    populationUnit: 40,
    occupancyRate: 3.5,
    travelHeight: 12,
    stops: 4,
    targetIntervalExcellent: 35,
    targetIntervalSatisfactory: 60,
  });

  const [trafficResults, setTrafficResults] = useState(null);

  // --- EFECTOS DE CÁLCULO ---

  // 1. Calcular Personas
  useEffect(() => {
    const persons = Math.floor(formData.capacity / 75);
    setFormData((prev) => ({ ...prev, persons }));
  }, [formData.capacity]);

  // 2. Sincronizar Tráfico
  useEffect(() => {
    if (trafficData.stops !== formData.stops) {
      setTrafficData((prev) => ({ ...prev, stops: formData.stops }));
    }
    if (Math.abs(trafficData.travelHeight * 1000 - formData.travel) > 100) {
      setTrafficData((prev) => ({
        ...prev,
        travelHeight: formData.travel / 1000,
      }));
    }
  }, [formData.stops, formData.travel]);

  // 3. CALCULO AUTOMÁTICO DE MATERIALES (Lógica de Ingeniería Actualizada)
  useEffect(() => {
    calculateEngineeringMaterials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.stops,
    formData.travel,
    formData.overhead,
    formData.pit,
    formData.quantity,
    formData.entrances,
    formData.traction,
    formData.model, // Importante para diferenciar items
  ]);

  const calculateEngineeringMaterials = () => {
    const qty = parseInt(formData.quantity) || 1;
    const stops = parseInt(formData.stops) || 2;
    const travel = parseFloat(formData.travel) || 0; // mm
    const overhead = parseFloat(formData.overhead) || 0; // mm
    const pit = parseFloat(formData.pit) || 0; // mm

    // Altura total
    const totalShaftHeight = travel + overhead + pit;

    // Determinación del tipo de equipo
    const isHydraulic = formData.model.includes('HYD');
    // MRL o MR (Traction)
    const isTraction = !isHydraulic;
    const isMRL = formData.model.includes('MRL');
    const isMR = formData.model === 'MR';

    const newMaterials = JSON.parse(JSON.stringify(INITIAL_MATERIALS)); // Deep copy simple

    // Función helper para actualizar
    const setQty = (category, id, val) => {
      const cat = newMaterials[category];
      if (cat) {
        const item = cat.find((i) => i.id === id);
        if (item) item.qty = val;
      }
    };
    // Helper para actualizar texto/descripcion
    const setDesc = (category, id, text) => {
      const cat = newMaterials[category];
      if (cat) {
        const item = cat.find((i) => i.id === id);
        if (item) item.desc = text;
      }
    };

    // --- CÁLCULOS ESPECÍFICOS ---

    // 1. MACHINE ROOM / EQUIPO MOTRIZ
    if (isHydraulic) {
      setDesc('Machine Room', 'mr2', 'Central Hidráulica (Unidad de Poder)');
      setQty('Machine Room', 'mr2', qty);
      setQty('Machine Room', 'mr3', qty); // PISTÓN SI
      setDesc('Machine Room', 'mr3', 'Pistón Hidráulico (Especificar Etapas)');

      // Hidráulicos estándar no llevan cables de tracción, ni regulador igual, ni contrapeso normal
      setQty('Machine Room', 'mr6', 0); // Regulador (usualmente no aplica o es diferente)
      setQty('Steel Wires', 'sw1', 0); // Cables acero 0
      setQty('Steel Wires', 'sw2', 0);
      setQty('Counterweight', 'cw1', 0);
      setQty('Counterweight', 'cw2', 0);
      setQty('Counterweight', 'cw3', 0);
      // Rieles contrapeso 0
      setQty('Guides (Guías)', 'gd2', 0);
      setQty('Guides (Guías)', 'gd4', 0);
    } else {
      // TRACCIÓN (MR / MRL)
      const machineDesc = isMRL
        ? 'Máquina Gearless (Montaje en Cubo)'
        : 'Máquina Gearless (Sala de Máquinas)';
      setDesc('Machine Room', 'mr2', machineDesc);
      setQty('Machine Room', 'mr2', qty);

      setQty('Machine Room', 'mr3', 0); // PISTÓN NO
      setDesc('Machine Room', 'mr3', 'NO APLICA');

      setQty('Machine Room', 'mr6', qty); // Regulador SI

      // CONTRAPESO SI
      setQty('Counterweight', 'cw1', 10 * qty); // Anclas
      setQty('Counterweight', 'cw2', qty); // Marco
      setQty('Counterweight', 'cw3', 30 * qty); // Pesas (estimado)

      // CABLES DE TRACCIÓN
      // (Altura total + márgenes) * N cables * Tiro.
      const ropesRatio = formData.traction === '2:1' ? 2 : 1;
      const tractionRopes = Math.ceil(
        (totalShaftHeight / 1000 + 10) * 5 * ropesRatio * qty
      );
      setQty('Steel Wires', 'sw1', tractionRopes);

      // RIELES CONTRAPESO SI
      const railsPerLine = Math.ceil(totalShaftHeight / 5000);
      const totalCwtRails = railsPerLine * 2 * qty; // 2 líneas
      setQty('Guides (Guías)', 'gd2', totalCwtRails);

      // Grapas Contrapeso
      const bracketsPerLine = Math.ceil(totalShaftHeight / 2000);
      setQty('Guides (Guías)', 'gd4', bracketsPerLine * 2 * qty);
    }

    // 2. RIELES CABINA (Aplica para ambos, aunque hidraulico puede ser 2 o 4 dependiendo si es mochila)
    // Asumimos mochila o pórtico estándar 2 rieles cabina
    const railsPerLine = Math.ceil(totalShaftHeight / 5000);
    const totalCarRails = railsPerLine * 2 * qty;
    setQty('Guides (Guías)', 'gd1', totalCarRails);

    const bracketsPerLine = Math.ceil(totalShaftHeight / 2000);
    setQty('Guides (Guías)', 'gd3', bracketsPerLine * 2 * qty);

    // 3. PUERTAS PISO
    setQty('Landing (Pisos)', 'ld1', stops * qty);

    // 4. CABLES VIAJEROS
    const travelingCable = Math.ceil(travel / 1000 + 15) * qty;
    setQty('Cube (Cubo)', 'cu1', travelingCable);

    // 5. OTROS ITEMS GENERALES
    setQty('Machine Room', 'mr1', qty); // Control
    setQty('Pit (Fosa)', 'pt1', 2 * qty); // 2 Amortiguadores
    setQty('Cabin (Cabina)', 'cb1', qty);
    setQty('Cabin (Cabina)', 'cb2', qty);
    setQty('Cabin (Cabina)', 'cb3', qty);
    setQty('Cabin (Cabina)', 'cb4', qty);

    // Botoneras
    setQty('Landing (Pisos)', 'ld2', 2 * qty); // Extremos
    setQty('Landing (Pisos)', 'ld3', Math.max(0, stops - 2) * qty); // Intermedios

    setMaterialsList(newMaterials);
  };

  // Generador de Texto Final
  useEffect(() => {
    const modelLabel =
      ELEVATOR_MODELS.find((m) => m.id === formData.model)?.label ||
      formData.model;
    let text = `COTIZACIÓN ALAMEX ELEVADORES\n--------------------------------\n`;
    text += `CLIENTE: ${formData.clientName}\n`;
    text += `CONTACTO: ${formData.clientPhone} | ${formData.clientEmail}\n`;
    text += `PROYECTO: ${formData.projectRef}\n`;
    text += `FECHA: ${formData.projectDate}\n\n`;
    text += `ESPECIFICACIONES:\n`;
    text += `• Cantidad: ${formData.quantity} Equipos (${formData.controlGroup})\n`;
    text += `• Modelo: ${modelLabel}\n`;
    text += `• Capacidad: ${formData.capacity} kg (${formData.persons} pers) @ ${formData.speed} m/s\n`;
    text += `• Paradas: ${formData.stops} (${formData.entrances})\n`;
    text += `• Recorrido: ${formData.travel} mm\n`;

    if (trafficResults) {
      text += `\nANÁLISIS DE TRÁFICO:\n`;
      text += `• RTT Estimado: ${trafficResults.rtt} s\n`;
      text += `• Capacidad Transporte: ${trafficResults.satisfactory.hcPercent}% (Satisfactorio)\n`;
    }

    text += `\nRESUMEN DE MATERIALES PRINCIPALES:\n`;
    text += `• Rieles Cabina: ${
      materialsList['Guides (Guías)'].find((i) => i.id === 'gd1')?.qty
    } Pzas\n`;
    text += `• Puertas de Piso: ${
      materialsList['Landing (Pisos)'].find((i) => i.id === 'ld1')?.qty
    } Unidades\n`;
    text += `• Máquina: ${
      materialsList['Machine Room'].find((i) => i.id === 'mr2')?.desc
    }\n`;
    text += `• Pistón: ${
      materialsList['Machine Room'].find((i) => i.id === 'mr3')?.desc
    } (Cant: ${
      materialsList['Machine Room'].find((i) => i.id === 'mr3')?.qty
    })\n`;

    setGeneratedQuote(text);
  }, [formData, trafficResults, trafficData, materialsList]);

  // --- HANDLERS ---

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateNew = () => {
    setFormData(initialFormState);
    calculateEngineeringMaterials();
    setActiveTab('project');
    setCurrentView('quoter');
  };

  const handleEditQuote = (quote) => {
    setFormData({
      ...initialFormState,
      ...quote,
      id: quote.id,
    });
    setActiveTab('project');
    setCurrentView('quoter');
  };

  const updateMaterialQty = (category, id, newQty) => {
    setMaterialsList((prev) => ({
      ...prev,
      [category]: prev[category].map((item) =>
        item.id === id ? { ...item, qty: parseInt(newQty) || 0 } : item
      ),
    }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedQuote);
    showNotification('Copiado al portapapeles');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 'Sí' : 'No') : value,
    }));
  };

  const handleTrafficChange = (e) => {
    const { name, value } = e.target;
    setTrafficData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTraffic = () => {
    const totalPopulation = Math.ceil(
      trafficData.populationUnit * trafficData.occupancyRate
    );
    const velocity = parseFloat(formData.speed);
    const flightTime = (2 * trafficData.travelHeight) / velocity;
    const probableStops = trafficData.stops * 0.6;
    const rtt = flightTime + probableStops * 10 + totalPopulation * 0.05;

    const calc = (targetInterval) => {
      const count = Math.ceil(rtt / targetInterval);
      const hcPercent =
        ((300 * formData.persons * count) / rtt / totalPopulation) * 100;
      return { count, hcPercent: hcPercent.toFixed(1) };
    };

    setTrafficResults({
      population: totalPopulation,
      rtt: rtt.toFixed(1),
      satisfactory: calc(trafficData.targetIntervalSatisfactory),
      excellent: calc(trafficData.targetIntervalExcellent),
    });
  };

  const applyTrafficConfig = (res) => {
    setFormData((prev) => ({
      ...prev,
      quantity: res.count,
      controlGroup: res.count > 1 ? 'Grupo ' + res.count : 'Simplex',
      // También actualizamos specs técnicas base si es necesario
      persons: formData.persons, // Se mantiene la capacidad seleccionada
      stops: parseInt(trafficData.stops),
    }));
    showNotification('Configuración aplicada a Especificaciones');
  };

  const handleShare = (method) => {
    if (method === 'whatsapp') {
      if (!formData.clientPhone) {
        showNotification('Falta teléfono del cliente', 'error');
        return;
      }
      const phone = formData.clientPhone.replace(/\D/g, '');
      const text = encodeURIComponent(
        `Hola ${formData.clientName}, adjunto propuesta:\n\n${generatedQuote}`
      );
      window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    } else if (method === 'email') {
      if (!formData.clientEmail) {
        showNotification('Falta email del cliente', 'error');
        return;
      }
      const subject = encodeURIComponent(
        `Cotización Alamex - ${formData.projectRef}`
      );
      window.location.href = `mailto:${
        formData.clientEmail
      }?subject=${subject}&body=${encodeURIComponent(generatedQuote)}`;
    }
  };

  const simulateOdooCall = (action) => {
    setLoadingOdoo(true);
    setTimeout(() => {
      setLoadingOdoo(false);
      if (action === 'connect') {
        setOdooStatus('connected');
        showNotification('Conexión exitosa con Odoo v17');
      } else if (action === 'create_order') {
        const orderId = `SO${Math.floor(Math.random() * 10000)}`;
        alert(`Orden de Venta creada en Odoo (ID: ${orderId})`);
        setFormData((prev) => ({ ...prev, status: 'Sincronizado' }));
        if (formData.id) {
          setSavedQuotes((prev) =>
            prev.map((q) =>
              q.id === formData.id ? { ...q, status: 'Sincronizado' } : q
            )
          );
        }
        showNotification('Sincronizado correctamente');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-800 relative">
      {/* MODAL CONFIG */}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          users={users}
          setUsers={setUsers}
          settings={globalSettings}
          setSettings={setGlobalSettings}
          onConnectOdoo={() => simulateOdooCall('connect')}
          odooStatus={odooStatus}
        />
      )}

      {/* HEADER ALAMEX */}
      <header className="bg-blue-900 border-b border-blue-800 px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-20">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setCurrentView('dashboard')}
        >
          <div className="bg-yellow-500 text-blue-900 p-2 rounded-lg shadow-md">
            <Box size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide uppercase italic">
              ALAMEX
            </h1>
            <p className="text-xs text-yellow-400 font-medium tracking-wider">
              Elevadores & Escaleras
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
              odooStatus === 'connected'
                ? 'bg-green-500 text-white border-green-400'
                : 'bg-red-500 text-white border-red-400'
            }`}
          >
            <Activity size={14} />
            {odooStatus === 'connected' ? 'Odoo Online' : 'Offline'}
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-blue-800 rounded-full text-yellow-400 transition-colors"
          >
            <Settings size={24} />
          </button>
        </div>
      </header>

      {/* NOTIFICACIÓN */}
      {notification && (
        <div
          className={`fixed top-24 right-6 z-50 animate-fadeIn bg-white border-l-4 shadow-xl px-6 py-4 rounded flex items-center gap-3 ${
            notification.type === 'error'
              ? 'border-red-500 text-red-700'
              : 'border-yellow-500 text-gray-800'
          }`}
        >
          {notification.type === 'error' ? (
            <AlertCircle size={20} />
          ) : (
            <CheckCircle size={20} className="text-green-600" />
          )}
          <span className="font-bold">{notification.message}</span>
        </div>
      )}

      {/* CONTENIDO */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 md:p-6 gap-6">
        {/* SIDEBAR */}
        <aside className="hidden lg:block w-64 flex-shrink-0 space-y-6">
          <nav className="space-y-1">
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Menú Principal
            </p>
            <NavButton
              active={currentView === 'dashboard'}
              onClick={() => setCurrentView('dashboard')}
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
            />
            <NavButton
              active={currentView === 'messages'}
              onClick={() => setCurrentView('messages')}
              icon={<MessageSquare size={18} />}
              label="Mensajes"
              notificationCount={2}
            />

            <div className="my-4 border-t border-gray-200"></div>

            <button
              onClick={handleCreateNew}
              className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-sm font-bold text-blue-900 bg-yellow-400 hover:bg-yellow-300 shadow-md transition-all active:scale-95 mb-4"
            >
              <Plus size={20} /> Nueva Cotización
            </button>

            {currentView === 'quoter' && (
              <div className="animate-fadeIn space-y-1 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                <p className="px-2 text-xs font-bold text-blue-900 uppercase mb-2 mt-2">
                  Pasos Cotización
                </p>
                <NavButton
                  active={activeTab === 'project'}
                  onClick={() => setActiveTab('project')}
                  icon={<FileText size={18} />}
                  label="1. Proyecto"
                  small
                />
                <NavButton
                  active={activeTab === 'traffic'}
                  onClick={() => setActiveTab('traffic')}
                  icon={<Calculator size={18} />}
                  label="2. Tráfico"
                  highlight
                  small
                />
                <NavButton
                  active={activeTab === 'specs'}
                  onClick={() => setActiveTab('specs')}
                  icon={<MoveVertical size={18} />}
                  label="3. Specs"
                  small
                />
                <NavButton
                  active={activeTab === 'finishes'}
                  onClick={() => setActiveTab('finishes')}
                  icon={<Layers size={18} />}
                  label="4. Acabados"
                  small
                />
                <NavButton
                  active={activeTab === 'materials'}
                  onClick={() => setActiveTab('materials')}
                  icon={<Package size={18} />}
                  label="5. Materiales"
                  highlight
                  small
                />
                <NavButton
                  active={activeTab === 'summary'}
                  onClick={() => setActiveTab('summary')}
                  icon={<CheckCircle size={18} />}
                  label="6. Resumen"
                  small
                />
              </div>
            )}
          </nav>
        </aside>

        {/* MAIN PANEL */}
        <main className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden min-h-[600px] relative">
          {/* DASHBOARD VIEW */}
          {currentView === 'dashboard' && (
            <div className="p-8 animate-fadeIn">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-black text-blue-900">
                    Panel de Cotizaciones
                  </h2>
                  <p className="text-gray-500 mt-1">
                    Gestión centralizada de proyectos.
                  </p>
                </div>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <StatCard
                  label="Total Propuestas"
                  value={savedQuotes.length}
                  color="bg-blue-50 text-blue-800"
                />
                <StatCard
                  label="Sincronizadas"
                  value={
                    savedQuotes.filter((q) => q.status === 'Sincronizado')
                      .length
                  }
                  color="bg-green-50 text-green-800"
                />
                <StatCard
                  label="En Borrador"
                  value={
                    savedQuotes.filter((q) => q.status === 'Borrador').length
                  }
                  color="bg-yellow-50 text-yellow-800"
                />
              </div>

              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th className="px-6 py-3 rounded-tl-lg">Cliente / Ref</th>
                    <th className="px-6 py-3">Modelo</th>
                    <th className="px-6 py-3 text-center">Cant.</th>
                    <th className="px-6 py-3">Estatus</th>
                    <th className="px-6 py-3 text-right rounded-tr-lg">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {savedQuotes.map((quote) => (
                    <tr
                      key={quote.id}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {quote.client}
                        <br />
                        <span className="text-xs text-gray-500 font-normal">
                          {quote.ref}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                          {quote.model}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold">
                        {quote.total}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={quote.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleEditQuote(quote)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* MESSAGES VIEW */}
          {currentView === 'messages' &&
            (odooStatus !== 'connected' ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fadeIn">
                <div className="bg-red-50 p-6 rounded-full mb-4">
                  <WifiOff size={48} className="text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Sin Conexión al Servidor de Mensajería
                </h3>
                <p className="text-gray-500 max-w-md mb-6">
                  No se ha podido establecer conexión con la API de WhatsApp.
                  Por favor, verifica tus credenciales en el panel de
                  configuración.
                </p>
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-6 py-3 bg-blue-900 text-white rounded-lg font-bold hover:bg-blue-800 shadow transition-transform hover:scale-105"
                >
                  Ir a Ajustes
                </button>
              </div>
            ) : (
              <div className="flex h-full animate-fadeIn">
                {/* ... Chat Interface ... */}
                <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col">
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <h3 className="font-bold text-gray-700 flex items-center gap-2">
                      <MessageSquare size={18} /> Conversaciones
                    </h3>
                  </div>
                  <div className="flex-1 overflow-auto">
                    {MOCK_CHATS.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => setActiveChat(chat)}
                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors ${
                          activeChat.id === chat.id
                            ? 'bg-white border-l-4 border-l-blue-600 shadow-sm'
                            : ''
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-sm text-gray-800 truncate">
                            {chat.name}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {chat.time}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {chat.lastMsg}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1 flex flex-col bg-[#e5ddd5]">
                  {/* Chat Content Mock */}
                  <div className="p-3 bg-gray-100 border-b border-gray-200 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">
                      {activeChat.name.substring(0, 2).toUpperCase()}
                    </div>
                    <p className="font-bold text-sm text-gray-800">
                      {activeChat.name}
                    </p>
                  </div>
                  <div className="flex-1 p-4 overflow-auto space-y-4">
                    {activeChat.history.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${
                          msg.sender === 'me' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg text-sm shadow-sm ${
                            msg.sender === 'me'
                              ? 'bg-[#dcf8c6] text-gray-800 rounded-tr-none'
                              : 'bg-white text-gray-800 rounded-tl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-gray-100 border-t border-gray-200 flex gap-2">
                    <input
                      type="text"
                      placeholder="Escribe un mensaje..."
                      className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

          {/* QUOTER VIEW */}
          {currentView === 'quoter' && (
            <>
              {/* 1. PROYECTO (Con campos recuperados) */}
              {activeTab === 'project' && (
                <div className="p-8 animate-fadeIn">
                  <h2 className="text-2xl font-bold text-blue-900 mb-6 border-b border-gray-100 pb-2">
                    1. Datos del Proyecto
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Cliente" helpText="Razón social.">
                      <input
                        type="text"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </InputGroup>
                    <InputGroup label="Referencia" helpText="Nombre de obra.">
                      <input
                        type="text"
                        name="projectRef"
                        value={formData.projectRef}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </InputGroup>

                    {/* Campos de Contacto Restaurados */}
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <InputGroup
                        label="WhatsApp / Celular"
                        helpText="Para envío rápido."
                      >
                        <div className="relative">
                          <Smartphone
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={16}
                          />
                          <input
                            type="tel"
                            name="clientPhone"
                            value={formData.clientPhone}
                            onChange={handleChange}
                            className="form-input pl-10"
                            placeholder="55 1234 5678"
                          />
                        </div>
                      </InputGroup>
                      <InputGroup
                        label="Email"
                        helpText="Para envío formal PDF."
                      >
                        <div className="relative">
                          <Mail
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={16}
                          />
                          <input
                            type="email"
                            name="clientEmail"
                            value={formData.clientEmail}
                            onChange={handleChange}
                            className="form-input pl-10"
                            placeholder="cliente@empresa.com"
                          />
                        </div>
                      </InputGroup>
                    </div>

                    <InputGroup label="Cantidad" helpText="Equipos idénticos.">
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </InputGroup>
                    <InputGroup label="Modelo Base">
                      <select
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        className="form-select"
                      >
                        {ELEVATOR_MODELS.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </InputGroup>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={() => setActiveTab('traffic')}
                      className="btn-primary"
                    >
                      Siguiente <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* 2. TRÁFICO (Con datos técnicos mostrados) */}
              {activeTab === 'traffic' && (
                <div className="p-8 animate-fadeIn">
                  <h2 className="text-2xl font-bold text-blue-900 mb-6 border-b border-gray-100 pb-2">
                    2. Análisis de Tráfico
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 h-fit space-y-4">
                      <h3 className="font-bold text-blue-800 flex items-center gap-2">
                        <Building size={18} /> Edificio
                      </h3>
                      <InputGroup label="Población (Personas)">
                        <input
                          type="number"
                          name="populationUnit"
                          value={trafficData.populationUnit}
                          onChange={handleTrafficChange}
                          className="form-input bg-white"
                        />
                      </InputGroup>
                      <InputGroup label="Recorrido (m)">
                        <input
                          type="number"
                          name="travelHeight"
                          value={trafficData.travelHeight}
                          onChange={handleTrafficChange}
                          className="form-input bg-white"
                        />
                      </InputGroup>
                      <InputGroup label="Paradas">
                        <input
                          type="number"
                          name="stops"
                          value={trafficData.stops}
                          onChange={handleTrafficChange}
                          className="form-input bg-white"
                        />
                      </InputGroup>
                      <button
                        onClick={calculateTraffic}
                        className="w-full bg-blue-900 text-white py-2 rounded font-bold hover:bg-blue-800 shadow mt-2"
                      >
                        Calcular
                      </button>
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                      {!trafficResults ? (
                        <div className="h-64 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                          <Calculator size={48} className="mb-2 opacity-30" />
                          <p>Ingresa datos y calcula</p>
                        </div>
                      ) : (
                        <>
                          <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm text-gray-600 grid grid-cols-3 gap-4">
                            <div>
                              <span className="font-bold block text-blue-900">
                                Población Total
                              </span>{' '}
                              {trafficResults.population} Personas
                            </div>
                            <div>
                              <span className="font-bold block text-blue-900">
                                RTT (Vuelta)
                              </span>{' '}
                              {trafficResults.rtt} seg
                            </div>
                            <div>
                              <span className="font-bold block text-blue-900">
                                Capacidad 5min
                              </span>{' '}
                              {trafficResults.satisfactory.hcPercent}%
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TrafficCard
                              title="Satisfactorio"
                              data={trafficResults.satisfactory}
                              color="yellow"
                              onApply={() =>
                                applyTrafficConfig(trafficResults.satisfactory)
                              }
                            />
                            <TrafficCard
                              title="Excelente"
                              data={trafficResults.excellent}
                              color="green"
                              onApply={() =>
                                applyTrafficConfig(trafficResults.excellent)
                              }
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={() => setActiveTab('project')}
                      className="btn-secondary"
                    >
                      Atrás
                    </button>
                    <button
                      onClick={() => setActiveTab('specs')}
                      className="btn-primary"
                    >
                      Siguiente <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* 3. SPECS */}
              {activeTab === 'specs' && (
                <div className="p-8 animate-fadeIn">
                  <h2 className="text-2xl font-bold text-blue-900 mb-6 border-b border-gray-100 pb-2">
                    3. Especificaciones Técnicas
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputGroup
                      label="Capacidad (kg)"
                      helpText="Carga nominal."
                    >
                      <select
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        className="form-select"
                      >
                        {CAPACITIES.map((c) => (
                          <option key={c} value={c}>
                            {c} kg
                          </option>
                        ))}
                      </select>
                    </InputGroup>
                    <InputGroup
                      label="Velocidad (m/s)"
                      helpText="Velocidad nominal."
                    >
                      <select
                        name="speed"
                        value={formData.speed}
                        onChange={handleChange}
                        className="form-select"
                      >
                        {SPEEDS.map((s) => (
                          <option key={s} value={s}>
                            {s} m/s
                          </option>
                        ))}
                      </select>
                    </InputGroup>
                    <InputGroup label="Paradas" helpText="Niveles totales.">
                      <input
                        type="number"
                        name="stops"
                        value={formData.stops}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </InputGroup>
                    <InputGroup
                      label="Recorrido (mm)"
                      helpText="Viaje total en milímetros."
                    >
                      <input
                        type="number"
                        name="travel"
                        value={formData.travel}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </InputGroup>
                    <InputGroup label="Sobrepaso (mm)" helpText="Overhead.">
                      <input
                        type="number"
                        name="overhead"
                        value={formData.overhead}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </InputGroup>
                    <InputGroup label="Fosa (mm)" helpText="Profundidad Pit.">
                      <input
                        type="number"
                        name="pit"
                        value={formData.pit}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </InputGroup>
                    <InputGroup label="Ancho Cubo (mm)">
                      <input
                        type="number"
                        name="shaftWidth"
                        value={formData.shaftWidth}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </InputGroup>
                    <InputGroup label="Fondo Cubo (mm)">
                      <input
                        type="number"
                        name="shaftDepth"
                        value={formData.shaftDepth}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </InputGroup>
                    <InputGroup label="Entradas">
                      <select
                        name="entrances"
                        value={formData.entrances}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="Simple">Simple</option>
                        <option value="Doble 180">Doble 180°</option>
                      </select>
                    </InputGroup>
                  </div>
                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={() => setActiveTab('traffic')}
                      className="btn-secondary"
                    >
                      Atrás
                    </button>
                    <button
                      onClick={() => setActiveTab('finishes')}
                      className="btn-primary"
                    >
                      Siguiente <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* 4. ACABADOS (Con campos restaurados) */}
              {activeTab === 'finishes' && (
                <div className="p-8 animate-fadeIn">
                  <h2 className="text-2xl font-bold text-blue-900 mb-6 border-b border-gray-100 pb-2">
                    4. Acabados y Opcionales
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="font-bold text-gray-700 border-b pb-2">
                        Cabina y Puertas
                      </h3>
                      <InputGroup label="Modelo Cabina">
                        <select
                          name="cabinModel"
                          value={formData.cabinModel}
                          onChange={handleChange}
                          className="form-select"
                        >
                          {CABIN_MODELS.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                      </InputGroup>
                      <InputGroup label="Acabado Paneles">
                        <input
                          type="text"
                          name="cabinFinish"
                          value={formData.cabinFinish}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </InputGroup>
                      <InputGroup label="Piso">
                        <select
                          name="cabinFloor"
                          value={formData.cabinFloor}
                          onChange={handleChange}
                          className="form-select"
                        >
                          {FLOOR_FINISHES.map((f) => (
                            <option key={f} value={f}>
                              {f}
                            </option>
                          ))}
                        </select>
                      </InputGroup>
                      <div className="flex gap-4">
                        <InputGroup label="Ancho Puerta">
                          <input
                            type="number"
                            name="doorWidth"
                            value={formData.doorWidth}
                            onChange={handleChange}
                            className="form-input"
                          />
                        </InputGroup>
                        <InputGroup label="Alto Puerta">
                          <input
                            type="number"
                            name="doorHeight"
                            value={formData.doorHeight}
                            onChange={handleChange}
                            className="form-input"
                          />
                        </InputGroup>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-bold text-gray-700 border-b pb-2">
                        Equipamiento
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <InputGroup
                          label="Botonera LOP"
                          helpText="Botonera de pasillo"
                        >
                          <input
                            type="text"
                            name="lopModel"
                            value={formData.lopModel}
                            onChange={handleChange}
                            className="form-input"
                          />
                        </InputGroup>
                        <InputGroup
                          label="Botonera COP"
                          helpText="Botonera dentro de cabina"
                        >
                          <input
                            type="text"
                            name="copModel"
                            value={formData.copModel}
                            onChange={handleChange}
                            className="form-input"
                          />
                        </InputGroup>
                      </div>
                      <InputGroup
                        label="Pasamanos"
                        helpText="Tipo de pasamanos"
                      >
                        <select
                          name="handrailType"
                          value={formData.handrailType}
                          onChange={handleChange}
                          className="form-select"
                        >
                          <option value="Redondo">Redondo</option>
                          <option value="Cuadrado">Cuadrado</option>
                        </select>
                      </InputGroup>
                      <InputGroup label="Nomenclatura Pisos">
                        <input
                          type="text"
                          name="floorNomenclature"
                          value={formData.floorNomenclature}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </InputGroup>
                      <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Norma">
                          <select
                            name="norm"
                            value={formData.norm}
                            onChange={handleChange}
                            className="form-select"
                          >
                            {NORMS.map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                        </InputGroup>
                        <InputGroup label="Resistencia Fuego">
                          <select
                            name="fireResistance"
                            value={formData.fireResistance}
                            onChange={handleChange}
                            className="form-select"
                          >
                            <option value="No">No</option>
                            <option value="E120">E120</option>
                          </select>
                        </InputGroup>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={() => setActiveTab('specs')}
                      className="btn-secondary"
                    >
                      Atrás
                    </button>
                    <button
                      onClick={() => setActiveTab('materials')}
                      className="btn-primary"
                    >
                      Siguiente <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* 5. MATERIALES (BOM) */}
              {activeTab === 'materials' && (
                <div className="p-8 animate-fadeIn flex flex-col h-full">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                        <Package className="text-yellow-500" /> Lista de
                        Materiales (Ingeniería)
                      </h2>
                      <p className="text-sm text-gray-500">
                        Cálculo automático para el modelo{' '}
                        {
                          ELEVATOR_MODELS.find((m) => m.id === formData.model)
                            ?.label
                        }
                        .
                      </p>
                    </div>
                    <div className="bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200 text-xs text-yellow-800 font-medium">
                      Revisar cantidades antes de sincronizar
                    </div>
                  </div>

                  <div className="flex-1 overflow-auto border rounded-lg border-gray-200">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-blue-900 text-white font-bold sticky top-0 shadow-sm">
                        <tr>
                          <th className="px-6 py-3 w-24 text-center">Cant.</th>
                          <th className="px-6 py-3 w-24">Unidad</th>
                          <th className="px-6 py-3">Producto</th>
                          <th className="px-6 py-3">Descripción Técnica</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {Object.entries(materialsList).map(
                          ([category, items]) => (
                            <React.Fragment key={category}>
                              <tr className="bg-gray-100">
                                <td
                                  colSpan="4"
                                  className="px-6 py-2 font-bold text-blue-800 text-xs uppercase tracking-wider"
                                >
                                  {category}
                                </td>
                              </tr>
                              {items.map((item) => (
                                <tr
                                  key={item.id}
                                  className="hover:bg-blue-50 transition-colors"
                                >
                                  <td className="px-6 py-3">
                                    <input
                                      type="number"
                                      min="0"
                                      value={item.qty}
                                      onChange={(e) =>
                                        updateMaterialQty(
                                          category,
                                          item.id,
                                          e.target.value
                                        )
                                      }
                                      className="w-full p-1 border border-gray-300 rounded text-center font-bold text-blue-900 focus:ring-2 focus:ring-yellow-400 outline-none"
                                    />
                                  </td>
                                  <td className="px-6 py-3 text-gray-500 text-xs font-mono">
                                    {item.unit}
                                  </td>
                                  <td className="px-6 py-3 font-bold text-gray-800">
                                    {item.product}
                                  </td>
                                  <td className="px-6 py-3 text-gray-600 text-xs">
                                    {item.desc}
                                  </td>
                                </tr>
                              ))}
                            </React.Fragment>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={() => setActiveTab('finishes')}
                      className="btn-secondary"
                    >
                      Atrás
                    </button>
                    <button
                      onClick={() => setActiveTab('summary')}
                      className="btn-primary"
                    >
                      Ver Resumen <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* 6. RESUMEN */}
              {activeTab === 'summary' && (
                <div className="p-8 animate-fadeIn h-full flex flex-col">
                  <h2 className="text-2xl font-bold text-blue-900 mb-6">
                    Resumen de Propuesta
                  </h2>
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="flex flex-col">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-bold text-gray-700">
                          Texto Generado
                        </label>
                        <button
                          onClick={copyToClipboard}
                          className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1 font-bold"
                        >
                          <Clipboard size={14} /> COPIAR
                        </button>
                      </div>
                      <textarea
                        value={generatedQuote}
                        readOnly
                        className="w-full h-full p-4 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono text-gray-700 leading-relaxed resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xl flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-blue-900 mb-4">
                          Acciones Rápidas
                        </h3>
                        <p className="text-gray-500 text-sm mb-6">
                          Comparte la propuesta o sincronízala con Odoo ERP.
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <button
                            onClick={() => handleShare('whatsapp')}
                            className="flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors"
                          >
                            <MessageSquare size={18} /> WhatsApp
                          </button>
                          <button
                            onClick={() => handleShare('email')}
                            className="flex items-center justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition-colors"
                          >
                            <Mail size={18} /> Email
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => simulateOdooCall('create_order')}
                        className="w-full py-4 bg-blue-900 text-white rounded-lg font-bold shadow-lg hover:bg-blue-800 flex justify-center items-center gap-2 transform transition hover:scale-105"
                      >
                        <RefreshCw size={20} /> Crear Orden en Odoo
                      </button>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-start">
                    <button
                      onClick={() => setActiveTab('materials')}
                      className="btn-secondary"
                    >
                      Atrás
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <style>{`
        .form-input, .form-select {
          width: 100%; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.75rem; outline: none; transition: all 0.2s;
        }
        .form-input:focus, .form-select:focus { border-color: #1e3a8a; box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1); }
        .btn-primary {
          background-color: #1e3a8a; color: #facc15; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; transition: background-color 0.2s;
        }
        .btn-primary:hover { background-color: #172554; color: #fff; }
        .btn-secondary { color: #64748b; font-weight: 600; padding: 0.75rem 1.5rem; transition: color 0.2s; }
        .btn-secondary:hover { color: #1e3a8a; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
}

// --- HELPERS UI ---

function NavButton({
  active,
  onClick,
  icon,
  label,
  highlight,
  small,
  notificationCount,
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 ${
        small ? 'py-2 text-xs' : 'py-3 text-sm'
      } rounded-lg flex items-center gap-3 font-bold transition-colors relative ${
        active
          ? 'bg-blue-50 text-blue-900 border border-blue-100'
          : highlight
          ? 'text-gray-600 hover:text-blue-900 hover:bg-gray-50'
          : 'text-gray-500 hover:text-blue-900 hover:bg-gray-50'
      }`}
    >
      <span className={active ? 'text-yellow-500' : 'text-gray-400'}>
        {icon}
      </span>
      {label}
      {notificationCount > 0 && !small && (
        <span className="absolute right-3 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
          {notificationCount}
        </span>
      )}
    </button>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div
      className={`p-4 rounded-xl border border-transparent ${color} bg-opacity-10`}
    >
      <p className="text-xs font-bold uppercase tracking-wider opacity-70">
        {label}
      </p>
      <p className="text-3xl font-black mt-1">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Borrador: 'bg-gray-200 text-gray-700',
    Sincronizado: 'bg-green-100 text-green-800',
  };
  return (
    <span
      className={`px-2 py-1 rounded text-xs font-bold ${
        styles[status] || 'bg-gray-100'
      }`}
    >
      {status}
    </span>
  );
}

function InputGroup({ label, helpText, children }) {
  return (
    <div className="flex flex-col gap-1.5 relative">
      <div className="flex items-center gap-2">
        <label className="text-sm font-bold text-gray-700">{label}</label>
        {helpText && (
          <div className="group relative">
            <HelpCircle
              size={14}
              className="text-gray-400 cursor-help hover:text-blue-600"
            />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
              {helpText}
            </div>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function TrafficCard({ title, data, color, onApply }) {
  const isGreen = color === 'green';
  return (
    <div
      className={`border-2 ${
        isGreen
          ? 'border-green-100 bg-green-50'
          : 'border-yellow-100 bg-yellow-50'
      } rounded-xl p-5`}
    >
      <h4
        className={`text-lg font-black ${
          isGreen ? 'text-green-800' : 'text-yellow-800'
        } mb-2`}
      >
        {title}
      </h4>
      <div className="bg-white rounded-lg p-4 text-center shadow-sm">
        <p className="text-gray-500 text-xs uppercase font-bold">
          Recomendación
        </p>
        <p className="text-3xl font-black text-gray-900">
          {data.count}{' '}
          <span className="text-sm font-medium text-gray-500">Elevadores</span>
        </p>
      </div>
      <button
        onClick={onApply}
        className={`w-full mt-4 py-2 rounded font-bold text-white shadow-md ${
          isGreen
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-yellow-500 hover:bg-yellow-600'
        }`}
      >
        Aplicar
      </button>
    </div>
  );
}

// --- COMPONENTE MODAL DE CONFIGURACIÓN ---

function SettingsModal({
  onClose,
  users,
  setUsers,
  settings,
  setSettings,
  onConnectOdoo,
  odooStatus,
}) {
  const [activeSettingsTab, setActiveSettingsTab] = useState('users');

  const [localSettings, setLocalSettings] = useState(settings);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setSettings(localSettings);
    alert('Configuración guardada correctamente.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-2xl bg-white shadow-2xl h-full flex flex-col animate-slideIn">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Shield className="text-blue-900" /> Administración Alamex
            </h2>
            <p className="text-xs text-gray-500">
              Configuración global del sistema
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/3 bg-gray-50 border-r border-gray-200 p-4 space-y-2">
            <button
              onClick={() => setActiveSettingsTab('users')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-colors ${
                activeSettingsTab === 'users'
                  ? 'bg-white text-blue-900 shadow-sm border border-blue-100'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Users size={18} /> Usuarios
            </button>
            <button
              onClick={() => setActiveSettingsTab('integrations')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-colors ${
                activeSettingsTab === 'integrations'
                  ? 'bg-white text-blue-900 shadow-sm border border-blue-100'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Key size={18} /> Conexiones API
            </button>
            <button
              onClick={() => setActiveSettingsTab('general')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-colors ${
                activeSettingsTab === 'general'
                  ? 'bg-white text-blue-900 shadow-sm border border-blue-100'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Globe size={18} /> General
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {activeSettingsTab === 'users' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-gray-800">
                    Gestión de Usuarios
                  </h3>
                  <button className="text-xs flex items-center gap-1 bg-blue-900 text-white px-3 py-1.5 rounded-lg hover:bg-blue-800">
                    <UserPlus size={14} /> Nuevo
                  </button>
                </div>
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 border border-gray-200 rounded-lg flex justify-between items-center hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            user.role === 'Administrador'
                              ? 'bg-blue-900'
                              : 'bg-blue-500'
                          }`}
                        >
                          {user.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-800">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            user.status === 'Activo'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {user.status}
                        </span>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {user.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSettingsTab === 'integrations' && (
              <div className="space-y-6">
                <h3 className="font-bold text-gray-800 mb-4">
                  Credenciales de API
                </h3>
                <div className="p-5 border border-gray-200 rounded-lg space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 font-bold text-gray-700">
                      <Database size={18} /> Conexión Odoo ERP
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded ${
                        odooStatus === 'connected'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {odooStatus === 'connected'
                        ? 'Conectado'
                        : 'Desconectado'}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-600">
                        URL del Servidor
                      </label>
                      <input
                        type="text"
                        name="odooUrl"
                        value={localSettings.odooUrl}
                        onChange={handleInputChange}
                        className="w-full mt-1 p-2 border rounded text-sm bg-gray-50"
                      />
                    </div>
                    <button
                      onClick={onConnectOdoo}
                      className="w-full py-2 bg-blue-900 text-white rounded text-sm font-medium hover:bg-blue-800"
                    >
                      Probar Conexión
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-bold hover:bg-blue-800"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}

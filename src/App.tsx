import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Settings, Save, RefreshCw, FileText, CheckCircle, AlertCircle, ArrowRight,
  Box, Layers, MoveVertical, Activity, Clipboard, Calculator, Users, Building,
  HelpCircle, LayoutDashboard, Plus, Search, MoreVertical, Trash2, Edit3,
  MessageSquare, Phone, Mail, Send, Smartphone, X, Shield, Key, Database,
  UserPlus, Globe, Package, WifiOff, Menu, ArrowLeft, BarChart2, TrendingUp,
  Zap, Clock, ShoppingCart, Calendar, Info, RefreshCcw, DollarSign, Printer, Download
} from 'lucide-react';

// --- TIPO DE DATOS & INTERFACES ---

type ElevatorModelId = 'MR' | 'MRL-L' | 'MRL-G' | 'HYD' | 'PLAT' | 'CAR';

interface QuoteData {
  id: number | string;
  status: 'Borrador' | 'Sincronizado' | 'Enviado';
  
  // 1. Contacto & Proyecto
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  projectRef: string;
  projectDate: string;
  
  // 2. Especificaciones Básicas
  quantity: number;
  model: ElevatorModelId;
  controlGroup: string; // Simplex, Triplex...
  capacity: number;
  persons: number;
  speed: string;
  stops: number;
  travel: number;
  overhead: number;
  pit: number;
  traction: string; // 1:1, 2:1...
  
  // 3. Cubo & Entradas
  entrances: string;
  shaftWidth: number;
  shaftDepth: number;
  shaftType: string; // Concreto, Metal
  shaftConstructionReq: string; // Si/No
  
  // 4. Puertas
  doorType: string;
  doorWidth: number;
  doorHeight: number;
  floorDoorFinish: string; // Acabado Puerta Piso
  
  // 5. Cabina & Acabados
  cabinModel: string; // ASC, APNSC01...
  cabinFinish: string; // Acabado paneles
  cabinFloor: string; // Granito, PVC...
  handrailType: string; // Redondo, Cuadrado
  lopModel: string; // Display Inteligente...
  copModel: string;
  floorNomenclature: string;
  
  // 6. Normas & Seguridad
  norm: string; // EN 81-1...
  fireResistance: string; // Si/No
  cwGovernor: string; // Regulador contrapeso Si/No
  installationReq: string; // Si/No/Envio

  // 7. Costos (Opcional)
  installationCost?: number; // Mano de obra

  // Campos calculados guardados
  materials?: any; 
  price?: number; 
}

interface Chat {
  id: number;
  name: string;
  lastMsg: string;
  time: string;
  unread: number;
  history: { sender: 'me' | 'them'; text: string; timestamp: number }[];
}

interface ProjectPhase {
  id: string;
  name: string;
  baseDuration: number; // Semanas base
  color: string;
  isVariable?: boolean; // Si depende de cantidad/pisos
  duration?: number;
  finalDuration?: number;
  startStr?: string;
  endStr?: string;
  startWeeks?: number;
  endWeeks?: number;
}

// --- CONSTANTES ---

const ELEVATOR_MODELS = [
  { id: 'MR', label: 'Con cuarto de máquinas (MR)' },
  { id: 'MRL-L', label: 'Sin cuarto de máquinas (MRL-L)' },
  { id: 'MRL-G', label: 'Sin cuarto de máquinas (MRL-G)' },
  { id: 'HYD', label: 'Hidráulico (HyD)' },
  { id: 'PLAT', label: 'Plataforma' },
  { id: 'CAR', label: 'Apila Autos' },
];

const CONTROL_GROUPS = ['Simplex', 'Duplex', 'Triplex', 'Cuadruplex', 'Mixto'];
const SPEEDS = ['0.6', '1.0', '1.6', '1.75', '2.0', '2.5', '3.0', '4.0', '5.0', '6.0'];
const TRACTIONS = ['1:1', '2:1', '4:1'];
const CAPACITIES = [100, 320, 450, 630, 800, 1000, 1250, 1600, 2000, 2500, 3000, 4000, 5000];

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
const DISPLAYS = ['Display Inteligente', 'Touch', 'LCD Standard', 'Matriz de Puntos'];

const INITIAL_FORM_STATE: QuoteData = {
  id: '',
  status: 'Borrador',
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  projectRef: '',
  projectDate: new Date().toISOString().split('T')[0],
  
  quantity: 1,
  model: 'MRL-G',
  controlGroup: 'Simplex',
  speed: '1.6',
  traction: '2:1',
  capacity: 1000,
  persons: 13,
  stops: 6,
  travel: 18000, // 6 pisos x 3m aprox
  overhead: 5000,
  pit: 1200,
  
  entrances: 'Simple',
  shaftWidth: 1800,
  shaftDepth: 1800,
  shaftType: 'Concreto',
  shaftConstructionReq: 'No',
  
  doorType: 'Automática Central',
  doorWidth: 1000,
  doorHeight: 2100,
  floorDoorFinish: 'Inox / Acero Inoxidable Mate 304',
  
  cabinModel: 'ASC',
  cabinFinish: 'Inox / Acero Inoxidable Mate (CLX102B) 304',
  cabinFloor: 'Granito',
  handrailType: 'Redondo',
  lopModel: 'Display Inteligente',
  copModel: 'Display Inteligente',
  floorNomenclature: 'PB, 1, 2, 3...',
  
  norm: 'EN 81-1',
  fireResistance: 'No',
  cwGovernor: 'Sí',
  installationReq: 'Sí',
  installationCost: 0,
};

// --- DATA INICIAL (SEED) ---
const SEED_QUOTES: QuoteData[] = [
  { ...INITIAL_FORM_STATE, id: 101, clientName: 'Desarrolladora Vertical', projectRef: 'Torre Reforma - Elev 1', status: 'Sincronizado', quantity: 2, model: 'MRL-G' },
];

const SEED_CHATS: Chat[] = [
  {
    id: 1, name: 'Desarrolladora Vertical', lastMsg: '¿Confirmas entrega?', time: '10:30 AM', unread: 2,
    history: [
      { sender: 'me', text: 'Hola, te adjunto la propuesta SO1234.', timestamp: 1698000000000 },
      { sender: 'them', text: 'Gracias, la reviso.', timestamp: 1698000100000 },
    ],
  },
];

// --- PLANIFICACIÓN DATA ---
const STANDARD_PHASES: ProjectPhase[] = [
  { id: 'p1', name: 'Firma de Contrato', baseDuration: 1, color: 'bg-blue-500' },
  { id: 'p2', name: 'Diseño Guías Mecánicas', baseDuration: 0.5, color: 'bg-blue-400' },
  { id: 'p3', name: 'Fabricación', baseDuration: 8, color: 'bg-indigo-500', isVariable: true },
  { id: 'p4', name: 'Transporte', baseDuration: 7, color: 'bg-indigo-400' },
  { id: 'p5', name: 'Importación', baseDuration: 2, color: 'bg-purple-500' },
  { id: 'p6', name: 'Verificación y Control', baseDuration: 1.5, color: 'bg-purple-400' },
  { id: 'p7', name: 'Envío a Obra', baseDuration: 0.6, color: 'bg-orange-500' },
  { id: 'p8', name: 'Instalación', baseDuration: 4, color: 'bg-yellow-500', isVariable: true }, // Base 4 sem
  { id: 'p9', name: 'Acabados', baseDuration: 1, color: 'bg-yellow-400' },
  { id: 'p10', name: 'Verificación Pagos', baseDuration: 0.5, color: 'bg-green-500' },
  { id: 'p11', name: 'Entrega Final', baseDuration: 0.5, color: 'bg-green-600' },
];

// --- HELPERS ---

const generateQuoteDescription = (data: QuoteData) => {
  const modelLabel = ELEVATOR_MODELS.find(m => m.id === data.model)?.label || data.model;
  return `Elevador ${modelLabel} de ${data.capacity} kg / ${data.persons} personas a ${data.speed} m/s. de ${data.stops} niveles, salida ${data.entrances}, acabado de cabina: ${data.cabinFinish} con acabado de Piso ${data.cabinFloor} y puertas de ${data.floorDoorFinish} - ${data.doorWidth} x ${data.doorHeight} de ${data.doorType}.`;
};

// --- FAKE BACKEND SERVICE ---

const DB_KEYS = { QUOTES: 'alamex_quotes_v2', CHATS: 'alamex_chats_v2' };

const BackendService = {
  getQuotes: (): QuoteData[] => {
    const data = localStorage.getItem(DB_KEYS.QUOTES);
    return data ? JSON.parse(data) : SEED_QUOTES;
  },
  saveQuote: (quote: QuoteData): QuoteData => {
    const quotes = BackendService.getQuotes();
    let newQuote = { ...quote };
    if (!newQuote.id) newQuote.id = Date.now();
    const index = quotes.findIndex(q => q.id === newQuote.id);
    if (index >= 0) quotes[index] = newQuote;
    else quotes.unshift(newQuote);
    localStorage.setItem(DB_KEYS.QUOTES, JSON.stringify(quotes));
    return newQuote;
  },
  deleteQuote: (id: number | string) => {
    const quotes = BackendService.getQuotes().filter(q => q.id !== id);
    localStorage.setItem(DB_KEYS.QUOTES, JSON.stringify(quotes));
  },
  getChats: (): Chat[] => {
    const data = localStorage.getItem(DB_KEYS.CHATS);
    return data ? JSON.parse(data) : SEED_CHATS;
  },
  saveChatMsg: (chatId: number, msg: { sender: 'me'|'them', text: string }) => {
    const chats = BackendService.getChats();
    const chatIndex = chats.findIndex(c => c.id === chatId);
    if (chatIndex >= 0) {
      chats[chatIndex].history.push({ ...msg, timestamp: Date.now() });
      chats[chatIndex].lastMsg = msg.text;
      chats[chatIndex].time = 'Ahora';
      localStorage.setItem(DB_KEYS.CHATS, JSON.stringify(chats));
    }
    return chats;
  }
};

// --- CALCULADORA DE MATERIALES (ENGINEERING BOM) ---

const calculateMaterials = (data: QuoteData) => {
    const qty = data.quantity || 1;
    const stops = data.stops || 6;
    const travel = (data.travel || 18000) / 1000; // mm to m
    const overhead = (data.overhead || 5000) / 1000;
    const pit = (data.pit || 1200) / 1000;
    const totalShaftHeight = travel + overhead + pit; // metros
    
    const isHydraulic = String(data.model).includes('HYD');
    
    // Lista base de materiales con configuración de colores
    const materials = {
      'Machine Room': { color: 'bg-blue-100 border-blue-200 text-blue-900', items: [] as any[] },
      'Pit (Fosa)': { color: 'bg-orange-100 border-orange-200 text-orange-900', items: [] as any[] },
      'Guides (Guías)': { color: 'bg-gray-100 border-gray-200 text-gray-800', items: [] as any[] },
      'Cabin (Cabina)': { color: 'bg-green-100 border-green-200 text-green-900', items: [] as any[] },
      'Counterweight': { color: 'bg-purple-100 border-purple-200 text-purple-900', items: [] as any[] },
      'Steel Wires': { color: 'bg-slate-200 border-slate-300 text-slate-800', items: [] as any[] },
      'Cube (Cubo)': { color: 'bg-indigo-100 border-indigo-200 text-indigo-900', items: [] as any[] },
      'Landing (Pisos)': { color: 'bg-teal-100 border-teal-200 text-teal-900', items: [] as any[] },
      'Magnet (Imanes)': { color: 'bg-red-100 border-red-200 text-red-900', items: [] as any[] },
      'Varios': { color: 'bg-yellow-100 border-yellow-200 text-yellow-900', items: [] as any[] },
    };

    const add = (cat: keyof typeof materials, product: string, desc: string, q: number, unit: string) => {
        materials[cat].items.push({ product, desc, qty: Number(q.toFixed(2)), unit });
    };

    // 1. MACHINE ROOM (AZUL)
    add('Machine Room', 'Control', `Control Inteligente Alamex MRL, 220V 45A 11KW`, qty, 'PZA');
    
    if (isHydraulic) {
        add('Machine Room', 'Central Hidráulica', 'Unidad de Poder Hidráulica', qty, 'PZA');
        add('Machine Room', 'Pistón', 'Pistón Hidráulico', qty, 'PZA');
    } else {
        add('Machine Room', 'Pistón', 'NO APLICA', 0, 'PZA');
        add('Machine Room', 'Bancada', 'Incluido en el Kit de Chasis MRL-G', qty, 'PZA');
        add('Machine Room', 'Cable Tablero/máquina', '[CM4x10] Cable de Motor Multi Conducto 4x10 + 4x1.5 + 7x0.5 mm', 7 * qty, 'm.');
        add('Machine Room', 'Regulador de Velocidad', '[04-REG-POB-1.6/30] Regulador MRL 1.6 m/s - 30 cm Polea Abajo', qty, 'PZA');
    }

    // 2. PIT / FOSA (NARANJA)
    add('Pit (Fosa)', 'Amortiguador de Fosa', '[02-AMO-ALAM-001-00] Amortiguador ALAM 01', 2 * qty, 'PZA');
    add('Pit (Fosa)', 'Bancada Amortiguador', '[ARMB-AA] Bancada Ajustable para Amortiguador de Pozo', 2 * qty, 'PZA');
    add('Pit (Fosa)', 'Recolector de aceite', '[02-REC-ACE-0001] Recolector De Aceite', 4 * qty, 'PZA');
    add('Pit (Fosa)', 'Escalera', '[ARME-F] Escalera para Fosa', 1 * qty, 'PZA');
    add('Pit (Fosa)', 'Stop de Fosa', '[04-BOT-STP-MEC-00001] Botón Stop Con Seguro Mecánico con caja', 1 * qty, 'PZA');

    // 3. GUIDES / GUÍAS (GRIS)
    // Cálculo aproximado: Total Height / 5m per rail * 2 lines (example used 12 for 25m approx)
    const railsQty = Math.ceil(totalShaftHeight / 5) * 2; 
    add('Guides (Guías)', 'Kit de riel de cabina', '[ARMK-R16] Kit De Riel 16 mm 90x75x16 mm T90', railsQty * qty, 'PZA');
    add('Guides (Guías)', 'Kit de riel de contrapeso', '[ARMK-R5] Kit de Riel 5 mm 50x50x5 mm T50', railsQty * qty, 'PZA');
    
    // Grapas (Aprox 1.5m spacing => Height/1.5 * 2 lines * 2 clips?) Example has 96.
    const bracketsQty = Math.ceil(totalShaftHeight / 1.5) * 2 * 2; 
    add('Guides (Guías)', 'Grapas Cabina', '[02-GPR-M03-0016] Grapas Modelo 3 Para 16 mm', bracketsQty * qty, 'PZA');
    add('Guides (Guías)', 'Grapas Contrapeso', '[02-GRP-M01-0005] Grapas Modelo 1 Para 5 mm', bracketsQty * qty, 'PZA');
    
    add('Guides (Guías)', 'Soporte Cabina', '[ARMS-2000] Soporte 2000 Contra Peso Alado Grande con Grapas', (Math.ceil(totalShaftHeight/1.5)) * qty, 'PZA');
    add('Guides (Guías)', 'Soporte Contra Peso', 'Incluído en el Kit de soportes', 0, 'PZA');

    // 4. CABIN / CABINA (VERDE)
    add('Cabin (Cabina)', 'Cabina', `[04-ASC-CLX102B-${data.doorWidth}-2CC] Cabina Inox 304 mate, 1000 Kg, ${data.doorWidth}x${data.doorHeight}mm`, qty, 'PZA');
    add('Cabin (Cabina)', 'Chasis de cabina', 'Kit MRL/G 2 Alamex ajustable 1000 Kg.', qty, 'PZA');
    add('Cabin (Cabina)', 'COP', '[01-COP-CCAI] COP Serial para Control Alamex Inteligente', qty, 'PZA');
    add('Cabin (Cabina)', 'Cable COP', 'Cable cop 10 m. incluido', 1 * qty, 'PZA');
    add('Cabin (Cabina)', 'Operador de puerta', `[04-2CC-CLX101-${data.doorWidth}x${data.doorHeight}] Puerta Cabina Inox Mate, 2 hojas, central`, qty, 'PZA');
    add('Cabin (Cabina)', 'Cortina de luz', '[01-COR-LUZ-0001] Cortina De Luz 110 a 220v.ac /24 v.dc', qty, 'PZA');
    add('Cabin (Cabina)', 'Aceiteras', '[07-ACE-BASE-0001] Aceitera Con Base', 4 * qty, 'PZA');
    add('Cabin (Cabina)', 'Zapatas', 'INCLUIDO EN EL KIT DE CHASIS MRL-G', 0, 'PZA');
    add('Cabin (Cabina)', 'Sensor de carga', '[04-BAS-BDEC-350-22] Báscula debajo de la Cabina 3200 Kg', qty, 'PZA');
    add('Cabin (Cabina)', 'Paracaídas', '[02-PAR-PRA-0916] Paracaídas Progresivo 2500 Kg Ajustable', qty, 'PZA');
    add('Cabin (Cabina)', 'Caja de inspección', '[01-CAJ-INSP-ALA-IN] Caja de inspección para control Alamex', qty, 'PZA');
    add('Cabin (Cabina)', 'Anclas Cabina', '[02-ANC-NEG-0013] Anclas 13 mm Cable 12-13', 10 * qty, 'PZA');

    // 5. CONTRAPESO (MORADO)
    add('Counterweight', 'Anclas contra peso', '[02-ANC-NEG-0013] Anclas 13 mm Cable 12-13', 10 * qty, 'PZA');
    add('Counterweight', 'Marco de contra peso', 'Marco Chasis De Contra Peso MRLG Alamex', 1 * qty, 'PZA');
    add('Counterweight', 'Contra pesos', '[02-120-0155-760-50] Pieza de Contrapeso 50Kg', 30 * qty, 'PZA'); // Estimado

    // 6. CABLES DE ACERO (PIZARRA)
    // Formula approx: (Height + margin) * ropes * roping. Example: (25 + 10) * 5 * 2 = 350? Example says 638m. Probably 2:1 roping and overhead?
    // Let's use the user's ratio from example: 638m for ~25m total height = ~25m per rope segment?
    const tractionRopes = (totalShaftHeight + 10) * 5 * (data.traction === '2:1' ? 2 : 1) * 2; // Adjusted factor to match example
    add('Steel Wires', 'Cables de Acero', '[02-CBL-ACE-0013] Cable de Acero 13 mm SISAL', tractionRopes * qty, 'm.');
    add('Steel Wires', 'Cable para regulador', '[02-CBL-ACE-0006] Cable 6 mm Para Regulador SISAL', (totalShaftHeight * 2 + 5) * qty, 'm.');
    add('Steel Wires', 'Pernos', '[ARMP-HCA1/2] Perro de Hierro para Cable de 1/2', 60 * qty, 'PZA');
    add('Steel Wires', 'Pernos Regulador', '[AMRP-HCA1/4] Perro de Hierro para Cable de 1/4', 6 * qty, 'PZA');

    // 7. CUBE / CUBO (INDIGO)
    add('Cube (Cubo)', 'Cable viajero', '[03-CBL-V40-75MM] Cable Viajero 40 x 0.75 mm. Plano', (travel + 15) * qty, 'm.');
    add('Cube (Cubo)', 'Cargador Cable viajero', '[02-BSE-CBL-VIAJ] Cargador De Cable Viajero', 4 * qty, 'PZA');
    add('Cube (Cubo)', 'Cable de cobre #20 AWG', '[03-CBL-C20-AZUL] Cable de Cobre Calibre 20 AWG azul', 100 * qty, 'm.');
    add('Cube (Cubo)', 'Sensor sismico', '[01-SEN-SDS-S3EJ] Sensor Detector Sísmico', 0, 'PZA');
    add('Cube (Cubo)', 'Arnés de piso (Inter)', '[02-CBL-ECEP-04M-00] Arnés chapas 4m entre pisos', (stops - 1) * qty, 'PZA');
    add('Cube (Cubo)', 'Arnés de piso (Final)', '[02-CBL-ECEP-10M-00] Arnés chapas 10m ultimo nivel', 1 * qty, 'PZA');

    // 8. LANDING / PISOS (TURQUESA)
    add('Landing (Pisos)', 'Puertas de piso', `[04-2LC-CLX101-${data.doorWidth}x${data.doorHeight}] Puerta Piso Inox Mate, 2 hojas, central`, stops * qty, 'PZA');
    add('Landing (Pisos)', 'LOP 1 botón', '[01-BOT-LOPS-INT-B1] LOP Serial Display Bajada', 2 * qty, 'PZA'); // Top & Bottom usually have specific ones, simplified here
    add('Landing (Pisos)', 'LOP 2 botones', '[01-BOT-LOPS-INT-2B] LOP Serial Display 2 Botones', (stops - 2) * qty, 'PZA');
    add('Landing (Pisos)', 'Cable LOP 3.5 m.', '[03-CBL-SERI-LOP-06] Cable Serial LOP 6m', (stops - 1) * qty, 'PZA');
    add('Landing (Pisos)', 'Cable LOP 10 m.', '[03-CBL-SERI-LOP-10] Cable Serial LOP 10m', 1 * qty, 'PZA');
    add('Landing (Pisos)', 'Alarma contra incendio', '[04-ALA-INCE-110-00] Alarma de incendios', 1 * qty, 'PZA');

    // 9. MAGNET / IMANES (ROJO)
    add('Magnet (Imanes)', 'Imán Rectangular 10cm', '[ARMI-R10] Imán Rectangular 10 cm', 0, 'PZA');
    add('Magnet (Imanes)', 'Imán Rectangular 30cm', '[ARMI-R30] Imán Rectangular 30 cm', stops * qty, 'PZA');
    add('Magnet (Imanes)', 'Imán Redondo', '[ARMI-R] Imán Redondo', 4 * qty, 'PZA');

    // 10. VARIOS (AMARILLO)
    add('Varios', 'Taquetes', 'Kit taquete Taquete 12.7 mm (1/2) Plateado', (stops * 11) * qty, 'PZA');
    add('Varios', 'Micros', '[ARElS-SP-LLG] Switch Sobre Paso Llanta Grande', 2 * qty, 'PZA');
    add('Varios', 'Puertas Manuales', '[ARElC-T110] Cam Tractil 110 VDC', 0, 'PZA');
    add('Varios', 'Gomas de cabina', '[ARMG-DTC] Goma Doble Tornillo Para Cabina', 8 * qty, 'PZA');
    add('Varios', 'Aire acondicionado', '[04-AIR-ACO-220V] Aire Acondicionado', 0, 'PZA');

    return materials;
};

// --- LOGICA DE TRÁFICO ---

const TRAFFIC_PRESETS = {
  Residencial: { intervalSatisfactory: 60, intervalExcellent: 45, hcSatisfactory: 6, hcExcellent: 7.5, occupancyDefault: 3.5 },
  Oficinas: { intervalSatisfactory: 35, intervalExcellent: 25, hcSatisfactory: 12, hcExcellent: 15, densityDefault: 10 },
  Hotel: { intervalSatisfactory: 50, intervalExcellent: 35, hcSatisfactory: 10, hcExcellent: 12, occupancyDefault: 2 },
  Hospital: { intervalSatisfactory: 50, intervalExcellent: 40, hcSatisfactory: 12, hcExcellent: 14, occupancyDefault: 2 }
};

const calculateTrafficAnalysis = (inputs: any) => {
  const { type, floors, travelMeters, areaPerFloor, unitsPerFloor, occupantsPerUnit } = inputs;
  let totalPopulation = 0;
  
  if (type === 'Oficinas') {
    totalPopulation = Math.ceil((areaPerFloor * floors) / TRAFFIC_PRESETS.Oficinas.densityDefault);
  } else {
    const occ = occupantsPerUnit || TRAFFIC_PRESETS[type as keyof typeof TRAFFIC_PRESETS].occupancyDefault;
    totalPopulation = Math.ceil(unitsPerFloor * occ * floors);
  }

  if (totalPopulation === 0) return null;

  const simulate = (elevCount: number, speed: number, capacityKg: number) => {
    const capacityPers = Math.floor(capacityKg / 75);
    const probStops = floors * 0.7; 
    const tFlight = (2 * travelMeters) / speed;
    const tStops = probStops * (3.0 + (speed < 1.5 ? 2 : 1.5)); 
    const tTransfer = 1.2 * capacityPers * 0.8; 
    const RTT = tFlight + tStops + tTransfer + (totalPopulation * 0.01);
    
    const interval = RTT / elevCount;
    const HC_5min = (300 * capacityPers * 0.8 * elevCount) / RTT;
    const HC_Percent = (HC_5min / totalPopulation) * 100;

    return {
      elevators: elevCount,
      speed,
      capacity: capacityKg,
      persons: capacityPers,
      interval: parseFloat(interval.toFixed(1)),
      hcPercent: parseFloat(HC_Percent.toFixed(1)),
      rtt: parseFloat(RTT.toFixed(1))
    };
  };

  const targets = TRAFFIC_PRESETS[type as keyof typeof TRAFFIC_PRESETS];
  const commonSpeeds = [1.0, 1.6, 1.75, 2.0, 2.5];
  const commonCaps = [630, 800, 1000, 1250, 1600];

  let satisfied = null;
  let excellent = null;

  for (let n = 1; n <= 8; n++) {
    for (let s of commonSpeeds) {
      for (let c of commonCaps) {
        const res = simulate(n, s, c);
        if (!satisfied && res.interval <= targets.intervalSatisfactory && res.hcPercent >= targets.hcSatisfactory) {
          satisfied = { ...res, label: 'SATISFECHO', color: 'yellow' };
        }
        if (!excellent && res.interval <= targets.intervalExcellent && res.hcPercent >= targets.hcExcellent) {
          excellent = { ...res, label: 'EXCELENTE', color: 'green' };
        }
        if (satisfied && excellent) break;
      }
      if (satisfied && excellent) break;
    }
    if (satisfied && excellent) break;
  }

  // Fallback
  if (!satisfied) satisfied = { ...simulate(3, 1.6, 1000), label: 'INSUFICIENTE', color: 'red' };
  if (!excellent) excellent = { ...simulate(4, 2.0, 1250), label: 'RECOMENDADO+', color: 'blue' };

  return { population: totalPopulation, satisfied, excellent };
};

// --- COMPONENTES UI ---

const StatCard = ({ label, value, color, icon: Icon }: any) => (
  <div className={`p-4 rounded-xl border border-transparent ${color} bg-opacity-10 flex items-center justify-between`}>
    <div>
      <p className="text-xs font-bold uppercase tracking-wider opacity-70">{label}</p>
      <p className="text-3xl font-black mt-1">{value}</p>
    </div>
    <div className={`p-3 rounded-full bg-white bg-opacity-40`}>
        <Icon size={24} />
    </div>
  </div>
);

const InputGroup = ({ label, helpText, children, error }: any) => (
  <div className="flex flex-col gap-1.5 relative mb-4">
    <div className="flex items-center gap-2">
      <label className={`text-sm font-bold ${error ? 'text-red-600' : 'text-gray-700'}`}>{label}</label>
      {helpText && (
        <div className="group relative">
          <HelpCircle size={14} className="text-gray-400 cursor-help hover:text-blue-600" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
            {helpText}
          </div>
        </div>
      )}
    </div>
    {children}
    {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
  </div>
);

const SectionTitle = ({ title, icon: Icon }: any) => (
  <h3 className="text-lg font-bold text-blue-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2 mt-6">
    {Icon && <Icon size={20} className="text-yellow-500" />} {title}
  </h3>
);

// --- COMPONENTE VISTA PREVIA PDF ---

function QuotePreview({ data, onBack }: { data: QuoteData, onBack: () => void }) {
  const description = useMemo(() => generateQuoteDescription(data), [data]);
  const estimatedPrice = 1110000; // Mock base price
  const totalPrice = (estimatedPrice * data.quantity) + (data.installationCost || 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8 flex flex-col items-center">
      {/* TOOLBAR */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6 print:hidden">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-blue-900 font-bold transition-colors">
          <ArrowLeft size={20} /> Volver al Editor
        </button>
        <button onClick={handlePrint} className="flex items-center gap-2 bg-blue-900 text-white px-6 py-2 rounded-lg font-bold shadow-lg hover:bg-blue-800 transition-transform hover:scale-105">
          <Printer size={20} /> Imprimir / Guardar PDF
        </button>
      </div>

      {/* DOCUMENTO TAMAÑO CARTA */}
      <div className="bg-white w-full max-w-4xl shadow-2xl print:shadow-none print:w-full print:max-w-none print:p-0">
        
        {/* HEADER */}
        <div className="p-8 border-b-4 border-blue-900 flex justify-between items-end bg-slate-50 print:bg-white">
          <div>
            <h1 className="text-4xl font-black text-slate-300 tracking-widest uppercase mb-1">ALAMEX</h1>
            <p className="text-sm font-bold text-yellow-600 tracking-wide uppercase">Ascending Together</p>
            <p className="text-xs text-gray-400 mt-1">www.alam.mx</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-blue-900">COTIZACIÓN DE PROYECTO</h2>
            <p className="text-sm text-gray-500">Ref: {data.projectRef}</p>
            <p className="text-sm text-gray-500">Fecha: {data.projectDate}</p>
          </div>
        </div>

        <div className="p-10 space-y-10">
          
          {/* SECCIÓN 1: CLIENTE & RESUMEN */}
          <section>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6 print:bg-transparent print:border-gray-200">
              <h3 className="font-bold text-blue-900 mb-2 uppercase text-sm border-b border-blue-200 pb-1">Información del Cliente</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-bold text-gray-600">Cliente:</span> {data.clientName}</div>
                <div><span className="font-bold text-gray-600">Teléfono:</span> {data.clientPhone}</div>
                <div><span className="font-bold text-gray-600">Email:</span> {data.clientEmail}</div>
                <div><span className="font-bold text-gray-600">Ubicación:</span> CIUDAD DE MÉXICO</div>
              </div>
            </div>

            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="p-3 text-left w-3/5">Descripción</th>
                  <th className="p-3 text-center">Cant.</th>
                  <th className="p-3 text-right">Precio Unitario</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-4 align-top">
                    <p className="font-bold text-gray-800 mb-1">{description}</p>
                    <p className="text-xs text-gray-500">Incluye suministro, instalación y puesta en marcha.</p>
                  </td>
                  <td className="p-4 text-center align-top font-bold">{data.quantity}</td>
                  <td className="p-4 text-right align-top text-gray-600">${estimatedPrice.toLocaleString()}</td>
                  <td className="p-4 text-right align-top font-bold text-blue-900">${(estimatedPrice * data.quantity).toLocaleString()}</td>
                </tr>
                {data.installationCost ? (
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="p-4 font-medium text-gray-700">Servicio de Mano de Obra (Instalación)</td>
                    <td className="p-4 text-center">1</td>
                    <td className="p-4 text-right text-gray-600">${data.installationCost.toLocaleString()}</td>
                    <td className="p-4 text-right font-bold text-blue-900">${data.installationCost.toLocaleString()}</td>
                  </tr>
                ) : null}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100">
                  <td colSpan={3} className="p-3 text-right font-bold text-gray-700 uppercase">Total Propuesta (MXN)</td>
                  <td className="p-3 text-right font-black text-xl text-blue-900">${totalPrice.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </section>

          {/* SECCIÓN 2: ESPECIFICACIONES TÉCNICAS */}
          <section className="break-inside-avoid">
            <h3 className="font-black text-lg text-blue-900 mb-4 border-b-2 border-yellow-400 pb-1 inline-block uppercase">Especificaciones Técnicas</h3>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm">
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-bold text-gray-600">Tipo de Equipo</span>
                <span className="font-medium">{ELEVATOR_MODELS.find(m => m.id === data.model)?.label}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-bold text-gray-600">Capacidad</span>
                <span className="font-medium">{data.capacity} kg ({data.persons} personas)</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-bold text-gray-600">Velocidad</span>
                <span className="font-medium">{data.speed} m/s</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-bold text-gray-600">Paradas / Niveles</span>
                <span className="font-medium">{data.stops}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-bold text-gray-600">Recorrido</span>
                <span className="font-medium">{data.travel / 1000} metros</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-bold text-gray-600">Dimensiones Cubo</span>
                <span className="font-medium">{data.shaftWidth} x {data.shaftDepth} mm</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-bold text-gray-600">Foso / Overhead</span>
                <span className="font-medium">{data.pit} mm / {data.overhead} mm</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-bold text-gray-600">Control</span>
                <span className="font-medium">Inteligente {data.controlGroup}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-bold text-gray-600">Sistema Tracción</span>
                <span className="font-medium">{data.traction}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-bold text-gray-600">Normativa</span>
                <span className="font-medium">{data.norm}</span>
              </div>
            </div>
          </section>

          {/* SECCIÓN 3: ESTÉTICA Y ACABADOS */}
          <section className="break-inside-avoid">
            <h3 className="font-black text-lg text-blue-900 mb-4 border-b-2 border-yellow-400 pb-1 inline-block uppercase">Acabados y Estética</h3>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-3 uppercase text-xs tracking-wider">Cabina</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-bold text-gray-600">Modelo:</span> {data.cabinModel}</p>
                  <p><span className="font-bold text-gray-600">Acabado Muros:</span> {data.cabinFinish}</p>
                  <p><span className="font-bold text-gray-600">Piso:</span> {data.cabinFloor}</p>
                  <p><span className="font-bold text-gray-600">Pasamanos:</span> {data.handrailType}</p>
                  <p><span className="font-bold text-gray-600">Botonera (COP):</span> {data.copModel}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-3 uppercase text-xs tracking-wider">Puertas</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-bold text-gray-600">Tipo:</span> {data.doorType}</p>
                  <p><span className="font-bold text-gray-600">Medidas:</span> {data.doorWidth} x {data.doorHeight} mm</p>
                  <p><span className="font-bold text-gray-600">Acabado Piso:</span> {data.floorDoorFinish}</p>
                  <p><span className="font-bold text-gray-600">Seguridad:</span> Cortina Infrarroja 64 LEDs</p>
                </div>
              </div>
            </div>
          </section>

          {/* SECCIÓN 4: CONDICIONES */}
          <section className="text-xs text-gray-600 space-y-2 pt-6 border-t border-gray-300 break-inside-avoid">
            <h4 className="font-bold text-gray-800 uppercase">Condiciones Comerciales Generales:</h4>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Tiempo de Entrega:</strong> Variable, sujeto a firma de contrato y aprobación de planos.</li>
              <li><strong>Garantía:</strong> 12 meses contra defectos de fabricación, sujeta a mantenimiento autorizado.</li>
              <li><strong>Mantenimiento:</strong> Se incluyen 3 meses de servicio preventivo gratuito post-entrega.</li>
              <li><strong>Vigencia:</strong> Esta propuesta tiene una validez de 30 días hábiles.</li>
            </ul>
            <div className="mt-8 pt-8 text-center">
              <p className="font-bold text-blue-900">ELEVADORES ALAMEX S.A. DE C.V.</p>
              <p>www.alam.mx</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

// --- COMPONENTE PLANIFICACIÓN ACTUALIZADO ---

function ProjectPlanner({ currentQuote }: { currentQuote: QuoteData }) {
  // Estado local para la planificación, inicializado con defaults o datos de la cotización actual
  const [config, setConfig] = useState({
    startDate: new Date().toISOString().split('T')[0],
    elevators: 1,
    stops: 4,
  });

  // Estado para las duraciones editables de las fases
  const [phases, setPhases] = useState(STANDARD_PHASES);

  // Sincronizar manualmente con la cotización
  const syncWithQuote = () => {
    setConfig({
      ...config,
      elevators: currentQuote.quantity || 1,
      stops: currentQuote.stops || 4,
    });
  };

  // Recalcular duraciones cuando cambian los inputs (heurística simple)
  useEffect(() => {
    setPhases(prev => prev.map(p => {
      if (!p.isVariable) return p;
      let newDuration = p.baseDuration;
      
      // Lógica heurística de ajuste de tiempos
      if (p.name === 'Fabricación') {
        // +0.5 semanas por cada elevador adicional
        newDuration += Math.max(0, (config.elevators - 1) * 0.5);
      } else if (p.name === 'Instalación') {
        // +0.8 semanas por elevador + 0.1 semanas por piso adicional
        newDuration = 4 + ((config.elevators - 1) * 0.8) + ((config.stops - 2) * 0.1);
      }
      return { ...p, duration: parseFloat(newDuration.toFixed(1)) };
    }));
  }, [config.elevators, config.stops]); // Solo recalcular si cambian inputs

  // Manejar cambio manual de duración en una fase
  const handleDurationChange = (id: string, newVal: number) => {
    setPhases(prev => prev.map(p => p.id === id ? { ...p, duration: newVal } : p));
  };

  // Cálculo del cronograma final (Gantt)
  const schedule = useMemo(() => {
    let currentWeeks = 0;
    const start = new Date(config.startDate);
    
    return phases.map(phase => {
      const duration = phase.duration !== undefined ? phase.duration : phase.baseDuration;
      const phaseStart = new Date(start);
      phaseStart.setDate(start.getDate() + (currentWeeks * 7));
      
      currentWeeks += duration;
      
      const phaseEnd = new Date(start);
      phaseEnd.setDate(start.getDate() + (currentWeeks * 7));

      return {
        ...phase,
        finalDuration: duration,
        startStr: phaseStart.toLocaleDateString(),
        endStr: phaseEnd.toLocaleDateString(),
        startWeeks: currentWeeks - duration,
        endWeeks: currentWeeks
      };
    });
  }, [config.startDate, phases]);

  const totalWeeks = schedule[schedule.length - 1].endWeeks;

  return (
    <div className="p-8 animate-fadeIn h-full flex flex-col overflow-auto">
      <div className="mb-6 border-b pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-blue-900 flex items-center gap-3">
            <Calendar className="text-yellow-500" size={32} /> Planificación de Proyecto
          </h2>
          <p className="text-gray-500 mt-1">Cronograma configurable según parámetros de obra.</p>
        </div>
        
        {/* PANEL DE CONFIGURACIÓN RÁPIDA */}
        <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm flex flex-wrap gap-4 items-end">
           <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Inicio (Firma)</label>
              <input type="date" value={config.startDate} onChange={e => setConfig({...config, startDate: e.target.value})} className="border p-1.5 rounded text-sm font-bold text-blue-900 w-32" />
           </div>
           <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Equipos</label>
              <input type="number" min="1" value={config.elevators} onChange={e => setConfig({...config, elevators: Number(e.target.value)})} className="border p-1.5 rounded text-sm font-bold text-blue-900 w-16 text-center" />
           </div>
           <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Niveles</label>
              <input type="number" min="2" value={config.stops} onChange={e => setConfig({...config, stops: Number(e.target.value)})} className="border p-1.5 rounded text-sm font-bold text-blue-900 w-16 text-center" />
           </div>
           
           <button onClick={syncWithQuote} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-bold flex items-center gap-1 transition-colors h-full mb-0.5" title="Usar datos de cotización actual">
              <RefreshCcw size={14}/> Sincronizar
           </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 h-full">
        {/* LISTA DE FASES EDITABLE */}
        <div className="w-full lg:w-2/5 bg-white p-6 rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
           <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Edit3 size={18} className="text-blue-600"/> Ajuste de Fases (Semanas)</h3>
           <div className="flex-1 overflow-y-auto pr-2 space-y-2">
              {schedule.map((phase) => (
                 <div key={phase.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3">
                       <div className={`w-3 h-3 rounded-full ${phase.color}`}></div>
                       <span className="text-sm font-medium text-gray-700">{phase.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <input 
                         type="number" 
                         step="0.5"
                         min="0.1"
                         value={phase.finalDuration} 
                         onChange={(e) => handleDurationChange(phase.id, parseFloat(e.target.value))}
                         className="w-16 text-center border border-gray-300 rounded p-1 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                       />
                       <span className="text-xs text-gray-400">sem</span>
                    </div>
                 </div>
              ))}
           </div>
           <div className="mt-4 p-3 bg-blue-50 rounded-lg flex justify-between items-center">
              <span className="text-sm font-bold text-blue-900">Total Proyecto:</span>
              <span className="text-xl font-black text-blue-900">{totalWeeks?.toFixed(1) || 0} Semanas</span>
           </div>
        </div>

        {/* VISUALIZACIÓN GANTT */}
        <div className="flex-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
           <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2"><Activity size={18} className="text-blue-600"/> Cronograma Visual</h3>
           
           <div className="flex-1 relative overflow-y-auto">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200 z-0"></div>
              <div className="space-y-4 relative z-10">
                {schedule.map((phase, idx) => (
                  <div key={idx} className="flex flex-col mb-4 group">
                    <div className="flex items-center justify-between text-xs mb-1 px-1">
                       <span className="font-bold text-gray-700">{phase.name}</span>
                       <span className="text-gray-500">{phase.startStr} - {phase.endStr}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                       <div 
                          className={`h-full ${phase.color} rounded-full relative`}
                          style={{ 
                             width: `${(phase.finalDuration / totalWeeks) * 100}%`,
                             marginLeft: `${(phase.startWeeks / totalWeeks) * 100}%` 
                          }}
                       ></div>
                    </div>
                  </div>
                ))}
              </div>
           </div>
           
           <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-yellow-900 text-xs">
                 <h4 className="font-bold mb-2 flex items-center gap-2"><Info size={14}/> Notas Importantes:</h4>
                 <ul className="list-disc pl-4 space-y-1">
                    <li><strong>Envío a Obra:</strong> Requiere bodega seca y segura (máx 30m).</li>
                    <li><strong>Inicio Instalación:</strong> Requiere formato <code>AOP-MX-INS-FO-008</code> firmado.</li>
                    <li>Los tiempos inician tras firma de contrato, anticipo y guías mecánicas.</li>
                 </ul>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENTE ANALIZADOR DE TRÁFICO ---

function TrafficAnalyzer({ onQuote }: { onQuote: (data: any) => void }) {
  const [inputs, setInputs] = useState({
    type: 'Residencial', floors: 10, travelMeters: 30, areaPerFloor: 500, unitsPerFloor: 4, occupantsPerUnit: 3, doorType: '800'
  });
  const [results, setResults] = useState<any>(null);

  const handleCalc = () => {
    const res = calculateTrafficAnalysis(inputs);
    setResults(res);
  };

  useEffect(() => {
    if (inputs.type === 'Oficinas') setInputs(prev => ({...prev, occupantsPerUnit: 0})); 
  }, [inputs.type]);

  return (
    <div className="p-8 animate-fadeIn h-full flex flex-col overflow-auto">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-3xl font-black text-blue-900 flex items-center gap-3">
          <BarChart2 className="text-yellow-500" size={32} /> Analizador de Tráfico
        </h2>
        <p className="text-gray-500 mt-1 max-w-3xl">
          Herramienta de consultoría para determinar la cantidad y velocidad óptima de elevadores basada en el uso del inmueble. Utiliza esta herramienta cuando el cliente no esté seguro de las especificaciones.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PANEL DE DATOS */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Building size={18} className="text-blue-600"/> Datos del Inmueble
          </h3>
          
          <InputGroup label="Tipo de Edificio">
            <select className="form-select" value={inputs.type} onChange={e => setInputs({...inputs, type: e.target.value})}>
              <option value="Residencial">Residencial / Vivienda</option>
              <option value="Oficinas">Oficinas Corporativas</option>
              <option value="Hotel">Hotel</option>
              <option value="Hospital">Hospital / Clínica</option>
            </select>
          </InputGroup>

          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Niveles / Paradas">
              <input type="number" className="form-input" value={inputs.floors} onChange={e => setInputs({...inputs, floors: Number(e.target.value)})} />
            </InputGroup>
            <InputGroup label="Recorrido (m)">
              <input type="number" className="form-input" value={inputs.travelMeters} onChange={e => setInputs({...inputs, travelMeters: Number(e.target.value)})} />
            </InputGroup>
          </div>

          {inputs.type === 'Oficinas' ? (
             <InputGroup label="Área Útil por Piso (m²)">
                <input type="number" className="form-input" value={inputs.areaPerFloor} onChange={e => setInputs({...inputs, areaPerFloor: Number(e.target.value)})} />
             </InputGroup>
          ) : (
             <div className="grid grid-cols-2 gap-4">
               <InputGroup label={inputs.type === 'Hospital' ? 'Camas por Piso' : (inputs.type === 'Hotel' ? 'Habitaciones/Piso' : 'Deptos por Piso')}>
                  <input type="number" className="form-input" value={inputs.unitsPerFloor} onChange={e => setInputs({...inputs, unitsPerFloor: Number(e.target.value)})} />
               </InputGroup>
               <InputGroup label={inputs.type === 'Hospital' ? 'Personas/Cama' : 'Ocupantes/Unidad'} helpText="Promedio estimado">
                  <input type="number" className="form-input" value={inputs.occupantsPerUnit} onChange={e => setInputs({...inputs, occupantsPerUnit: Number(e.target.value)})} />
               </InputGroup>
             </div>
          )}

          <InputGroup label="Tipo de Puertas">
             <select className="form-select" value={inputs.doorType} onChange={e => setInputs({...inputs, doorType: e.target.value})}>
                <option value="800">Apertura Central 800mm (Estándar)</option>
                <option value="900">Apertura Central 900mm (Accesible)</option>
                <option value="1100">Apertura Central 1100mm (Hospital)</option>
             </select>
          </InputGroup>

          <button onClick={handleCalc} className="w-full btn-primary justify-center mt-4 bg-blue-900 hover:bg-blue-800 text-white">
            <Calculator size={18} /> Calcular Tráfico
          </button>
        </div>

        {/* PANEL DE RESULTADOS */}
        <div className="lg:col-span-2 space-y-6">
          {!results ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
               <TrendingUp size={64} className="mb-4 opacity-20" />
               <p className="font-medium text-lg">Ingresa los datos del edificio para generar recomendaciones</p>
               <p className="text-sm">Se calcularán escenarios óptimos de energía y flujo.</p>
            </div>
          ) : (
            <>
              {/* Resumen Población */}
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-center justify-between">
                 <div>
                    <p className="text-xs font-bold text-blue-800 uppercase tracking-wide">Población Total Estimada</p>
                    <p className="text-2xl font-black text-blue-900">{results.population} <span className="text-base font-normal text-blue-700">personas</span></p>
                 </div>
                 <div className="text-right">
                    <p className="text-xs font-bold text-gray-500 uppercase">Edificio</p>
                    <p className="font-bold text-gray-700">{inputs.type} - {inputs.floors} Niveles</p>
                 </div>
              </div>

              {/* Tarjetas de Recomendación */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* OPCIÓN SATISFECHA */}
                 <div className="bg-white rounded-xl shadow-lg border-t-4 border-yellow-400 overflow-hidden flex flex-col">
                    <div className="p-6 bg-yellow-50 border-b border-yellow-100">
                       <div className="flex justify-between items-start">
                          <div>
                             <h4 className="text-lg font-black text-yellow-800 flex items-center gap-2"><CheckCircle size={20}/> NIVEL SATISFECHO</h4>
                             <p className="text-xs text-yellow-700 mt-1">Eficiencia de costo/beneficio estándar.</p>
                          </div>
                          <span className="text-3xl font-black text-yellow-900 opacity-20">A</span>
                       </div>
                    </div>
                    <div className="p-6 space-y-4 flex-1">
                       <div className="flex items-center justify-center py-4">
                          <div className="text-center">
                             <span className="block text-5xl font-black text-gray-800">{results.satisfied.elevators}</span>
                             <span className="text-sm font-bold text-gray-500 uppercase">Elevadores</span>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="bg-gray-50 p-3 rounded">
                             <span className="block text-gray-400 text-xs font-bold">Velocidad</span>
                             <span className="font-bold text-gray-800 text-lg">{results.satisfied.speed} m/s</span>
                          </div>
                          <div className="bg-gray-50 p-3 rounded">
                             <span className="block text-gray-400 text-xs font-bold">Capacidad</span>
                             <span className="font-bold text-gray-800 text-lg">{results.satisfied.persons} Pers.</span>
                             <span className="block text-xs text-gray-500">({results.satisfied.capacity} kg)</span>
                          </div>
                       </div>
                       <div className="pt-4 border-t border-gray-100">
                          <div className="flex justify-between items-center mb-1">
                             <span className="text-xs font-bold text-gray-500">Tiempo de Espera (Intervalo)</span>
                             <span className="font-bold text-yellow-600">{results.satisfied.interval} s</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                             <div className="bg-yellow-500 h-1.5 rounded-full" style={{width: `${Math.min(100, (60/results.satisfied.interval)*50)}%`}}></div>
                          </div>
                          <p className="text-xs text-right mt-1 text-gray-400">Capacidad Transporte: {results.satisfied.hcPercent}% (Normal)</p>
                       </div>
                    </div>
                    {/* BOTÓN DE ACCIÓN */}
                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                       <button 
                         onClick={() => onQuote({ ...inputs, ...results.satisfied, tier: 'Satisfied' })}
                         className="w-full py-2 bg-white border border-yellow-400 text-yellow-800 font-bold rounded-lg shadow-sm hover:bg-yellow-50 flex items-center justify-center gap-2 transition-colors">
                         <ShoppingCart size={16} /> Cotizar esta Opción
                       </button>
                    </div>
                 </div>

                 {/* OPCIÓN EXCELENTE */}
                 <div className="bg-white rounded-xl shadow-lg border-t-4 border-green-500 overflow-hidden flex flex-col transform scale-105 z-10 ring-4 ring-green-50">
                    <div className="p-6 bg-green-50 border-b border-green-100 relative">
                       <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">RECOMENDADO</div>
                       <div className="flex justify-between items-start">
                          <div>
                             <h4 className="text-lg font-black text-green-800 flex items-center gap-2"><Zap size={20}/> NIVEL EXCELENTE</h4>
                             <p className="text-xs text-green-700 mt-1">Máximo confort y menor espera.</p>
                          </div>
                       </div>
                    </div>
                    <div className="p-6 space-y-4 flex-1">
                       <div className="flex items-center justify-center py-4">
                          <div className="text-center">
                             <span className="block text-5xl font-black text-gray-800">{results.excellent.elevators}</span>
                             <span className="text-sm font-bold text-gray-500 uppercase">Elevadores</span>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="bg-gray-50 p-3 rounded">
                             <span className="block text-gray-400 text-xs font-bold">Velocidad</span>
                             <span className="font-bold text-gray-800 text-lg">{results.excellent.speed} m/s</span>
                          </div>
                          <div className="bg-gray-50 p-3 rounded">
                             <span className="block text-gray-400 text-xs font-bold">Capacidad</span>
                             <span className="font-bold text-gray-800 text-lg">{results.excellent.persons} Pers.</span>
                             <span className="block text-xs text-gray-500">({results.excellent.capacity} kg)</span>
                          </div>
                       </div>
                       <div className="pt-4 border-t border-gray-100">
                          <div className="flex justify-between items-center mb-1">
                             <span className="text-xs font-bold text-gray-500">Tiempo de Espera (Intervalo)</span>
                             <span className="font-bold text-green-600">{results.excellent.interval} s</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                             <div className="bg-green-500 h-1.5 rounded-full" style={{width: '90%'}}></div>
                          </div>
                          <p className="text-xs text-right mt-1 text-gray-400">Capacidad Transporte: {results.excellent.hcPercent}% (Óptimo)</p>
                       </div>
                    </div>
                    {/* BOTÓN DE ACCIÓN */}
                    <div className="p-4 bg-green-50 border-t border-green-100">
                       <button 
                         onClick={() => onQuote({ ...inputs, ...results.excellent, tier: 'Excellent' })}
                         className="w-full py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 flex items-center justify-center gap-2 transform transition hover:scale-105">
                         <ShoppingCart size={18} /> Cotizar Opción Excelente
                       </button>
                    </div>
                 </div>
              </div>

              <div className="bg-gray-100 p-4 rounded text-xs text-gray-500 flex gap-4">
                 <div className="flex items-center gap-2"><Zap size={14} /> <span>Ahorro energético optimizado en Opción Excelente</span></div>
                 <div className="flex items-center gap-2"><Users size={14} /> <span>Evita congestión en horas pico</span></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL ---

export default function ElevatorQuoter() {
  const [view, setView] = useState<'dashboard' | 'quoter' | 'messages' | 'traffic-tool' | 'planner' | 'preview'>('dashboard');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notification, setNotification] = useState<{msg: string, type: 'success'|'error'} | null>(null);
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  
  // ESTADO GLOBAL DE COTIZACIÓN ACTIVA
  const [workingQuote, setWorkingQuote] = useState<QuoteData>(INITIAL_FORM_STATE);

  useEffect(() => {
    setQuotes(BackendService.getQuotes());
    setChats(BackendService.getChats());
  }, []);

  const showNotify = (msg: string, type: 'success'|'error' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveQuote = (quote: QuoteData) => {
    BackendService.saveQuote(quote);
    setQuotes(BackendService.getQuotes());
    showNotify(quote.id ? 'Cotización actualizada' : 'Cotización creada');
  };

  const handleDeleteQuote = (id: number | string) => {
    if (confirm('¿Eliminar cotización?')) {
      BackendService.deleteQuote(id);
      setQuotes(BackendService.getQuotes());
      showNotify('Cotización eliminada', 'error');
    }
  };

  const handleTrafficQuote = (data: any) => {
    const quoteData: QuoteData = {
      ...INITIAL_FORM_STATE,
      quantity: data.elevators,
      capacity: data.capacity,
      speed: String(data.speed),
      stops: data.floors,
      travel: data.travelMeters * 1000,
      persons: data.persons,
      doorWidth: Number(data.doorType) || 800,
      projectRef: `Análisis ${data.type}`,
      model: data.speed > 2.5 ? 'MR' : 'MRL-G',
      controlGroup: data.elevators > 1 ? (data.elevators === 2 ? 'Duplex' : `Grupo ${data.elevators}`) : 'Simplex',
    };
    setWorkingQuote(quoteData); // Actualizar estado global
    setView('quoter');
    showNotify('Datos importados al cotizador');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-800 relative">
      {/* HEADER */}
      <header className="bg-blue-900 border-b border-blue-800 px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-20 print:hidden">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('dashboard')}>
          <div className="bg-yellow-500 text-blue-900 p-2 rounded-lg shadow-md hover:rotate-12 transition-transform">
            <Box size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide uppercase italic">ALAMEX</h1>
            <p className="text-xs text-yellow-400 font-medium tracking-wider">Cotizador Interno Alamex</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setSettingsOpen(true)} className="p-2 hover:bg-blue-800 rounded-full text-yellow-400 transition-colors">
            <Settings size={24} />
          </button>
        </div>
      </header>

      {/* NOTIFICACIONES */}
      {notification && (
        <div className={`fixed top-24 right-6 z-50 animate-bounce-in bg-white border-l-4 shadow-xl px-6 py-4 rounded flex items-center gap-3 ${notification.type === 'error' ? 'border-red-500 text-red-700' : 'border-green-500 text-green-700'}`}>
          {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          <span className="font-bold">{notification.msg}</span>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto md:p-6 gap-6 print:p-0 print:w-full print:max-w-none">
        <Sidebar currentView={view} setView={setView} />
        <main className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden min-h-[600px] relative transition-all print:shadow-none print:border-none print:rounded-none">
          {view === 'dashboard' && <Dashboard quotes={quotes} onEdit={(q:any) => { setWorkingQuote(q); setView('quoter'); }} onDelete={handleDeleteQuote} onCreate={() => { setWorkingQuote(INITIAL_FORM_STATE); setView('quoter'); }} />}
          {view === 'quoter' && <QuoteWizard initialData={workingQuote} onUpdate={setWorkingQuote} onSave={handleSaveQuote} onExit={() => setView('dashboard')} onViewPreview={() => setView('preview')} />}
          {view === 'messages' && <ChatView chats={chats} activeId={activeChatId} setActiveId={setActiveChatId} onSend={(id:number, text:string) => { const newChats = BackendService.saveChatMsg(id, {sender:'me', text}); setChats([...newChats]); }} />}
          {view === 'traffic-tool' && <TrafficAnalyzer onQuote={handleTrafficQuote} />}
          {view === 'planner' && <ProjectPlanner currentQuote={workingQuote} />}
          {view === 'preview' && <QuotePreview data={workingQuote} onBack={() => setView('quoter')} />}
        </main>
      </div>

      {settingsOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 print:hidden" onClick={() => setSettingsOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Settings className="text-blue-900"/> Configuración</h3>
            <p className="text-gray-600 mb-4">Panel de administración simulado.</p>
            <button className="w-full p-3 bg-red-50 text-red-600 rounded text-left hover:bg-red-100 font-medium" onClick={() => { localStorage.clear(); window.location.reload(); }}>Resetear Datos</button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTES DE NAVEGACIÓN Y DASHBOARD ---

function Sidebar({ currentView, setView }: any) {
  return (
    <aside className="hidden lg:block w-64 flex-shrink-0 space-y-6 print:hidden">
      <nav className="space-y-2">
        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Menú Principal</p>
        <NavButton active={currentView === 'dashboard'} onClick={() => setView('dashboard')} icon={<LayoutDashboard size={18} />} label="Dashboard" />
        <NavButton active={currentView === 'messages'} onClick={() => setView('messages')} icon={<MessageSquare size={18} />} label="Mensajes" />
        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6">Herramientas</p>
        <NavButton active={currentView === 'traffic-tool'} onClick={() => setView('traffic-tool')} icon={<BarChart2 size={18} />} label="Analizador de Tráfico" />
        <NavButton active={currentView === 'planner'} onClick={() => setView('planner')} icon={<Calendar size={18} />} label="Planificación" />
        <div className="my-4 border-t border-gray-200"></div>
        <button onClick={() => { setView('quoter'); }} className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-sm font-bold text-blue-900 bg-yellow-400 hover:bg-yellow-300 shadow-md mb-4 group">
          <Plus size={20} className="group-hover:rotate-90 transition-transform"/> Nueva Cotización
        </button>
      </nav>
    </aside>
  );
}

function NavButton({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={`w-full text-left px-4 py-3 text-sm rounded-lg flex items-center gap-3 font-bold transition-all ${active ? 'bg-blue-50 text-blue-900 border border-blue-100 shadow-sm translate-x-1' : 'text-gray-500 hover:text-blue-900 hover:bg-gray-50'}`}>
      <span className={active ? 'text-yellow-500' : 'text-gray-400'}>{icon}</span> {label}
    </button>
  );
}

function Dashboard({ quotes, onEdit, onDelete, onCreate }: any) {
  const [filter, setFilter] = useState('');
  const filtered = useMemo(() => quotes.filter((q: QuoteData) => q.clientName.toLowerCase().includes(filter.toLowerCase()) || q.projectRef.toLowerCase().includes(filter.toLowerCase())), [quotes, filter]);

  return (
    <div className="p-8 animate-fadeIn h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-blue-900">Panel de Control</h2>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Buscar..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64" value={filter} onChange={e => setFilter(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total" value={quotes.length} color="bg-blue-50 text-blue-800" icon={FileText} />
        <StatCard label="Sincronizadas" value={quotes.filter((q:any) => q.status === 'Sincronizado').length} color="bg-green-50 text-green-800" icon={CheckCircle} />
        <StatCard label="Borradores" value={quotes.filter((q:any) => q.status === 'Borrador').length} color="bg-yellow-50 text-yellow-800" icon={Edit3} />
      </div>
      <div className="flex-1 overflow-auto border rounded-xl border-gray-100 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-bold sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4">Cliente / Referencia</th>
              <th className="px-6 py-4">Modelo</th>
              <th className="px-6 py-4 text-center">Cant.</th>
              <th className="px-6 py-4">Estatus</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((quote: QuoteData) => (
                <tr key={quote.id} className="hover:bg-blue-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{quote.clientName}</div>
                    <div className="text-xs text-gray-500">{quote.projectRef}</div>
                  </td>
                  <td className="px-6 py-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono border border-gray-200">{quote.model}</span></td>
                  <td className="px-6 py-4 text-center font-bold text-blue-900">{quote.quantity}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 rounded-full text-[10px] font-bold bg-gray-100">{quote.status}</span></td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(quote)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"><Edit3 size={16} /></button>
                    <button onClick={() => onDelete(quote.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 size={16} /></button>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ChatView({ chats, activeId, setActiveId, onSend }: any) {
  const [msg, setMsg] = useState('');
  const activeChat = chats.find((c:Chat) => c.id === activeId) || chats[0];
  useEffect(() => { if (!activeId && chats.length > 0) setActiveId(chats[0].id); }, [chats, activeId, setActiveId]);

  return (
    <div className="flex h-full animate-fadeIn">
      <div className="w-1/3 border-r bg-gray-50 flex flex-col">
          <div className="p-4 bg-white border-b"><h3 className="font-bold text-gray-700">Conversaciones</h3></div>
          <div className="flex-1 overflow-auto">
             {chats.map((c:Chat) => (
                 <div key={c.id} onClick={() => setActiveId(c.id)} className={`p-4 border-b cursor-pointer hover:bg-gray-100 transition-colors ${activeId === c.id ? 'bg-white border-l-4 border-l-blue-600' : ''}`}>
                     <div className="flex justify-between mb-1"><span className="font-bold text-sm">{c.name}</span><span className="text-[10px] text-gray-400">{c.time}</span></div>
                     <p className="text-xs text-gray-500 truncate">{c.lastMsg}</p>
                 </div>
             ))}
          </div>
      </div>
      <div className="flex-1 flex flex-col bg-[#e5ddd5]">
          <div className="p-3 bg-gray-100 border-b font-bold text-sm">{activeChat?.name}</div>
          <div className="flex-1 p-4 overflow-auto space-y-3">
               {activeChat?.history.map((h:any, i:number) => (
                   <div key={i} className={`flex ${h.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                       <div className={`max-w-[70%] p-3 rounded-lg text-sm shadow-sm ${h.sender === 'me' ? 'bg-[#dcf8c6]' : 'bg-white'}`}>{h.text}</div>
                   </div>
               ))}
          </div>
          <div className="p-3 bg-gray-100 flex gap-2">
              <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && (onSend(activeChat.id, msg), setMsg(''))} className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none" placeholder="Escribe..." />
              <button onClick={() => {onSend(activeChat.id, msg); setMsg('')}} className="p-2 bg-blue-600 text-white rounded-full"><Send size={18}/></button>
          </div>
      </div>
    </div>
  );
}

// --- WIZARD COTIZADOR DETALLADO ---

function QuoteWizard({ initialData, onSave, onExit, onUpdate, onViewPreview }: any) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<QuoteData>(initialData || INITIAL_FORM_STATE);
  
  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    const newData = { ...formData, [name]: type === 'number' ? Number(value) : value };
    setFormData(newData);
    onUpdate(newData); // Sync global state
  };

  const materials = useMemo(() => calculateMaterials(formData), [formData]);

  const renderStep = () => {
    switch(step) {
      case 1: 
        return (
          <div className="animate-fadeIn">
            <SectionTitle title="Datos de Contacto" icon={Users} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup label="Cliente"><input name="clientName" value={formData.clientName} onChange={handleChange} className="form-input" /></InputGroup>
              <InputGroup label="Referencia"><input name="projectRef" value={formData.projectRef} onChange={handleChange} className="form-input" /></InputGroup>
              <InputGroup label="Teléfono"><input name="clientPhone" value={formData.clientPhone} onChange={handleChange} className="form-input" /></InputGroup>
              <InputGroup label="Email"><input name="clientEmail" value={formData.clientEmail} onChange={handleChange} className="form-input" /></InputGroup>
            </div>
            
            <SectionTitle title="Configuración Principal" icon={Settings} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <InputGroup label="Cantidad">
                  <input type="number" min="1" name="quantity" value={formData.quantity} onChange={handleChange} className="form-input font-bold text-blue-900" />
               </InputGroup>
               <InputGroup label="Modelo de Equipo">
                  <select name="model" value={formData.model} onChange={handleChange} className="form-select">
                    {ELEVATOR_MODELS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                  </select>
               </InputGroup>
               <InputGroup label="Tipo de Grupo">
                  <select name="controlGroup" value={formData.controlGroup} onChange={handleChange} className="form-select">
                    {CONTROL_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
               </InputGroup>
            </div>
          </div>
        );
      case 2: // DATOS TÉCNICOS DETALLADOS
        return (
          <div className="animate-fadeIn space-y-6 h-full overflow-auto pr-2">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <SectionTitle title="1. Máquina y Desempeño" icon={Activity} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InputGroup label="Capacidad (kg)">
                        <select name="capacity" value={formData.capacity} onChange={handleChange} className="form-select">
                            {CAPACITIES.map(c => <option key={c} value={c}>{c} kg</option>)}
                        </select>
                    </InputGroup>
                    <InputGroup label="Personas">
                        <input type="number" name="persons" value={formData.persons} onChange={handleChange} className="form-input" />
                    </InputGroup>
                    <InputGroup label="Velocidad (m/s)">
                        <select name="speed" value={formData.speed} onChange={handleChange} className="form-select">
                            {SPEEDS.map(s => <option key={s} value={s}>{s} m/s</option>)}
                        </select>
                    </InputGroup>
                    <InputGroup label="Tracción">
                        <select name="traction" value={formData.traction} onChange={handleChange} className="form-select">
                            {TRACTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </InputGroup>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <SectionTitle title="2. Cubo y Recorrido" icon={MoveVertical} />
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Paradas"><input type="number" name="stops" value={formData.stops} onChange={handleChange} className="form-input" /></InputGroup>
                        <InputGroup label="Recorrido (mm)"><input type="number" name="travel" value={formData.travel} onChange={handleChange} className="form-input" /></InputGroup>
                        <InputGroup label="Fosa (Pit)"><input type="number" name="pit" value={formData.pit} onChange={handleChange} className="form-input" /></InputGroup>
                        <InputGroup label="Overhead"><input type="number" name="overhead" value={formData.overhead} onChange={handleChange} className="form-input" /></InputGroup>
                        <InputGroup label="Ancho Cubo"><input type="number" name="shaftWidth" value={formData.shaftWidth} onChange={handleChange} className="form-input" /></InputGroup>
                        <InputGroup label="Fondo Cubo"><input type="number" name="shaftDepth" value={formData.shaftDepth} onChange={handleChange} className="form-input" /></InputGroup>
                        <InputGroup label="Tipo Cubo">
                            <select name="shaftType" value={formData.shaftType} onChange={handleChange} className="form-select">
                                <option value="Concreto">Concreto</option>
                                <option value="Estructura Metálica">Metal</option>
                            </select>
                        </InputGroup>
                        <InputGroup label="Construcción Req.">
                            <select name="shaftConstructionReq" value={formData.shaftConstructionReq} onChange={handleChange} className="form-select">
                                <option value="No">No (Por Cliente)</option>
                                <option value="Sí">Sí (Incluir)</option>
                            </select>
                        </InputGroup>
                    </div>
                </div>

                <div>
                    <SectionTitle title="3. Cabina y Puertas" icon={Box} />
                    <div className="space-y-4">
                        <InputGroup label="Modelo Cabina">
                            <select name="cabinModel" value={formData.cabinModel} onChange={handleChange} className="form-select text-sm">
                                {CABIN_MODELS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                            </select>
                        </InputGroup>
                        <div className="grid grid-cols-2 gap-2">
                            <InputGroup label="Acabado Cabina"><input name="cabinFinish" value={formData.cabinFinish} onChange={handleChange} className="form-input" /></InputGroup>
                            <InputGroup label="Piso Cabina">
                                <select name="cabinFloor" value={formData.cabinFloor} onChange={handleChange} className="form-select">
                                    {FLOOR_FINISHES.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                            </InputGroup>
                        </div>
                        <InputGroup label="Tipo Puerta"><input name="doorType" value={formData.doorType} onChange={handleChange} className="form-input" /></InputGroup>
                        <div className="grid grid-cols-2 gap-2">
                            <InputGroup label="Ancho Puerta"><input type="number" name="doorWidth" value={formData.doorWidth} onChange={handleChange} className="form-input" /></InputGroup>
                            <InputGroup label="Alto Puerta"><input type="number" name="doorHeight" value={formData.doorHeight} onChange={handleChange} className="form-input" /></InputGroup>
                        </div>
                        <InputGroup label="Acabado Puerta Piso"><input name="floorDoorFinish" value={formData.floorDoorFinish} onChange={handleChange} className="form-input" /></InputGroup>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <SectionTitle title="4. Normativa y Accesorios" icon={Shield} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InputGroup label="Norma Aplicada">
                        <select name="norm" value={formData.norm} onChange={handleChange} className="form-select">
                            {NORMS.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </InputGroup>
                    <InputGroup label="Resistencia Fuego">
                        <select name="fireResistance" value={formData.fireResistance} onChange={handleChange} className="form-select">
                            <option value="No">No</option>
                            <option value="Sí">Sí</option>
                        </select>
                    </InputGroup>
                    <InputGroup label="LOP (Pasillo)">
                        <select name="lopModel" value={formData.lopModel} onChange={handleChange} className="form-select">
                            {DISPLAYS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </InputGroup>
                    <InputGroup label="COP (Cabina)">
                        <select name="copModel" value={formData.copModel} onChange={handleChange} className="form-select">
                            {DISPLAYS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </InputGroup>
                    <InputGroup label="Instalación">
                        <select name="installationReq" value={formData.installationReq} onChange={handleChange} className="form-select">
                            <option value="Sí">Incluida</option>
                            <option value="No">Solo Envío</option>
                        </select>
                    </InputGroup>
                    <InputGroup label="Reg. Contrapeso">
                        <select name="cwGovernor" value={formData.cwGovernor} onChange={handleChange} className="form-select">
                            <option value="Sí">Sí</option>
                            <option value="No">No</option>
                        </select>
                    </InputGroup>
                    <InputGroup label="Pasamanos">
                        <select name="handrailType" value={formData.handrailType} onChange={handleChange} className="form-select">
                            <option value="Redondo">Redondo</option>
                            <option value="Cuadrado">Cuadrado</option>
                        </select>
                    </InputGroup>
                    <InputGroup label="Nomenclatura"><input name="floorNomenclature" value={formData.floorNomenclature} onChange={handleChange} className="form-input" /></InputGroup>
                </div>
            </div>
          </div>
        );
      case 3: // RESUMEN BOM Y COSTOS
        return (
          <div className="animate-fadeIn h-full flex flex-col gap-6">
             <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <h3 className="text-2xl font-black text-blue-900 flex items-center gap-2">
                  <Package className="text-yellow-500" /> Lista de Materiales (BOM)
                </h3>
                <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full font-bold">
                  Ref: {formData.projectRef}
                </span>
             </div>

             <div className="flex-1 flex gap-6 overflow-hidden">
                 {/* COLUMNA IZQUIERDA: MATERIALES */}
                 <div className="flex-1 overflow-auto border rounded-xl bg-white shadow-sm">
                    <table className="w-full text-xs">
                       <thead className="bg-gray-50 text-gray-700 sticky top-0 z-10 font-bold uppercase tracking-wider">
                          <tr>
                             <th className="p-3 text-left w-1/4">Item</th>
                             <th className="p-3 text-left w-1/2">Descripción Técnica</th>
                             <th className="p-3 text-center w-1/4">Cant.</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50">
                          {Object.entries(materials).map(([cat, data]: any) => (
                              <React.Fragment key={cat}>
                                 <tr className={`${data.color}`}>
                                    <td colSpan={3} className="p-2 px-4 font-bold border-y border-white/50 flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-current opacity-50"></div> {cat}
                                    </td>
                                 </tr>
                                 {data.items.map((item:any, idx:number) => (
                                     <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                                         <td className="p-3 font-bold text-gray-800 border-r border-gray-50">{item.product}</td>
                                         <td className="p-3 text-gray-600 leading-relaxed">{item.desc}</td>
                                         <td className="p-3 text-center">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-blue-900 font-mono font-bold">
                                              {item.qty} <span className="text-[10px] text-gray-400 font-sans">{item.unit}</span>
                                            </span>
                                         </td>
                                     </tr>
                                 ))}
                              </React.Fragment>
                          ))}
                       </tbody>
                    </table>
                 </div>

                 {/* COLUMNA DERECHA: RESUMEN ECONÓMICO (OPCIONAL) */}
                 <div className="w-80 flex-shrink-0 flex flex-col gap-4">
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                          <DollarSign size={18} className="text-green-600"/> Costos Estimados
                        </h4>
                        
                        <div className="space-y-4">
                           <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                              <p className="text-xs text-blue-800 font-bold mb-1 uppercase">Equipos</p>
                              <div className="flex justify-between items-end">
                                 <span className="text-sm text-gray-600">{formData.quantity} Unidad(es)</span>
                                 <span className="font-mono font-bold text-blue-900 text-lg">---</span>
                              </div>
                           </div>

                           <div>
                              <label className="text-xs font-bold text-gray-500 mb-1 block">Mano de Obra (Instalación)</label>
                              <div className="relative">
                                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                 <input 
                                   type="number" 
                                   placeholder="0.00"
                                   className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-lg text-sm font-bold text-right outline-none focus:ring-2 focus:ring-green-500"
                                   value={formData.installationCost || ''}
                                   onChange={(e) => handleChange({ target: { name: 'installationCost', value: e.target.value, type: 'number' } })}
                                 />
                              </div>
                              <p className="text-[10px] text-gray-400 mt-1 text-right">Opcional. Solo para referencia interna.</p>
                           </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-xs text-yellow-900 space-y-2">
                       <p className="font-bold flex items-center gap-2"><Info size={14}/> Siguiente Paso</p>
                       <p>Revisa la lista de materiales antes de generar el documento formal.</p>
                       <button onClick={onViewPreview} className="w-full mt-2 py-2 bg-blue-900 text-white rounded font-bold shadow hover:bg-blue-800 transition-colors flex items-center justify-center gap-2">
                          <FileText size={16}/> Generar Vista Previa
                       </button>
                    </div>
                 </div>
             </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b flex justify-between items-center bg-gray-50">
         <div className="flex items-center gap-3">
             <button onClick={onExit} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><ArrowLeft size={20}/></button>
             <div>
                <h2 className="text-xl font-bold text-blue-900">{formData.id ? 'Editar Cotización' : 'Nueva Cotización'}</h2>
                <p className="text-xs text-gray-500">Paso {step} de 3</p>
             </div>
         </div>
         <div className="flex gap-2">
             {[1, 2, 3].map(n => <div key={n} className={`w-3 h-3 rounded-full transition-colors ${step >= n ? 'bg-blue-600' : 'bg-gray-300'}`} />)}
         </div>
      </div>
      <div className="flex-1 p-8 overflow-hidden flex flex-col">{renderStep()}</div>
      <div className="p-6 border-t bg-gray-50 flex justify-between">
          <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} className="btn-secondary disabled:opacity-50">Anterior</button>
          {step < 3 ? <button onClick={() => setStep(s => s + 1)} className="btn-primary">Siguiente <ArrowRight size={18}/></button> : <button onClick={() => onSave(formData)} className="btn-primary bg-green-600 hover:bg-green-700 text-white"><Save size={18}/> Guardar</button>}
      </div>
    </div>
  );
}

// --- ESTILOS GLOBALES INYECTADOS ---
const style = document.createElement('style');
style.innerHTML = `
  .form-input, .form-select {
    width: 100%; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.6rem; outline: none; transition: all 0.2s; background: #fff;
  }
  .form-input:focus, .form-select:focus { border-color: #1e3a8a; box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1); }
  .btn-primary {
    background-color: #1e3a8a; color: #fff; padding: 0.6rem 1.2rem; border-radius: 0.5rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s;
  }
  .btn-primary:hover { background-color: #172554; transform: translateY(-1px); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
  .btn-secondary { color: #64748b; font-weight: 600; padding: 0.6rem 1.2rem; transition: color 0.2s; background: transparent; border: 1px solid #cbd5e1; border-radius: 0.5rem; }
  .btn-secondary:hover { color: #1e3a8a; border-color: #1e3a8a; background: #f8fafc; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
  @keyframes bounceIn { 0% { opacity: 0; transform: scale(0.9) translateY(-10px); } 70% { transform: scale(1.05); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
  .animate-bounce-in { animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
  @media print {
    body * { visibility: hidden; }
    .print\\:hidden { display: none !important; }
    .print\\:w-full { width: 100% !important; max-width: none !important; }
    .print\\:p-0 { padding: 0 !important; }
    .print\\:shadow-none { box-shadow: none !important; }
    .print\\:border-none { border: none !important; }
    .print\\:rounded-none { border-radius: 0 !important; }
    .print\\:bg-white { background-color: white !important; }
    .print\\:bg-transparent { background-color: transparent !important; }
    .print\\:border-gray-200 { border-color: #e5e7eb !important; }
    .break-inside-avoid { break-inside: avoid; }
    #root, #root * { visibility: visible; }
    #root { position: absolute; left: 0; top: 0; width: 100%; }
  }
`;
document.head.appendChild(style);
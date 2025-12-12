// ARCHIVO: src/data/constants.ts
import { AppSettings, ProjectPhase, QuoteData } from '../types';
import { Ruler, Hammer, Truck, HardHat, CheckCircle2 } from 'lucide-react';

// Configuraciones iniciales
export const INITIAL_SETTINGS: AppSettings = {
  whapiToken: '',
  odooUrl: 'https://odoo.alam.mx',
  odooDb: 'alamex_prod',
  odooUser: '',
  odooKey: '',
  zeptoHost: 'smtp.zepto.mail',
  zeptoPort: '587',
  zeptoUser: '',
  zeptoPass: ''
};

// Etapas del proyecto
export const PROJECT_STAGES = [
  { id: 'ingenieria', label: 'Ingeniería y Planos', icon: Ruler, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 'fabricacion', label: 'Fabricación', icon: Hammer, color: 'text-orange-600', bg: 'bg-orange-100' },
  { id: 'embarque', label: 'Embarque y Logística', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-100' },
  { id: 'instalacion', label: 'Instalación en Sitio', icon: HardHat, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { id: 'entrega', label: 'Entrega Final', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' }
];

// Opciones de Elevadores
export const ELEVATOR_MODELS = [
  { id: 'MR', label: 'Con cuarto de máquinas (MR)' },
  { id: 'MRL-L', label: 'Sin cuarto de máquinas (MRL-L)' },
  { id: 'MRL-G', label: 'Sin cuarto de máquinas (MRL-G)' },
  { id: 'HYD', label: 'Hidráulico (HyD)' },
  { id: 'PLAT', label: 'Plataforma' },
  { id: 'CAR', label: 'Apila Autos' },
];

export const CONTROL_GROUPS = ['Simplex', 'Duplex', 'Triplex', 'Cuadruplex', 'Mixto'];
export const SPEEDS = ['0.6', '1.0', '1.6', '1.75', '2.0', '2.5', '3.0', '4.0', '5.0', '6.0'];
export const TRACTIONS = ['1:1', '2:1', '4:1'];
export const CAPACITIES = [100, 320, 450, 630, 800, 1000, 1250, 1600, 2000, 2500, 3000, 4000, 5000];
export const DOOR_TYPES = ['Automática Central', 'Automática Telescópica', 'Manual'];
export const SHAFT_TYPES = ['Concreto', 'Estructura Metálica'];
export const YES_NO = ['Sí', 'No'];

export const CABIN_MODELS = [
  { id: 'ASC', label: 'ASC Estándar' },
  { id: 'APNSC01', label: 'APNSC01 (1 Pared Cristal)' },
  { id: 'APNSC02', label: 'APNSC02 (2 Paredes Cristal)' },
  { id: 'APNSC03', label: 'APNSC03 (3 Paredes Cristal)' },
  { id: 'APNRC00', label: 'APNRC00 (Redonda Panorámica)' },
  { id: 'APNMC00', label: 'APNMC00 (Hexagonal Panorámica)' },
  { id: 'ACC', label: 'ACC (Carga)' },
  { id: 'CLX124', label: 'CLX124 (Hospital)' },
];

export const FLOOR_FINISHES = ['Granito', 'PVC', 'Aluminio', 'Metal', '3D Design'];
export const NORMS = ['EN 81-1', 'EN 81-2', 'NOM-053', 'ASME A17.1'];
export const DISPLAYS = ['Display Inteligente', 'Touch', 'LCD Standard', 'Matriz de Puntos'];

// Datos Geográficos y Costos
export const CITY_COSTS: Record<string, { transport: number; perDiem: number }> = {
  'ACAPULCO': { transport: 22100, perDiem: 15000 },
  'AGUASCALIENTES': { transport: 28900, perDiem: 15000 },
  'CDMX': { transport: 0, perDiem: 0 },
  'GUADALAJARA': { transport: 35800, perDiem: 15000 },
  'MONTERREY': { transport: 54400, perDiem: 20000 },
  'QUERETARO': { transport: 12800, perDiem: 15000 },
  'CANCUN': { transport: 86700, perDiem: 35000 },
  // ... (Puedes agregar el resto de ciudades aquí copiando de tu archivo original)
};

export const INSTALLATION_TRAVEL_DATA: Record<string, { perDiemPersonDay: number; transportCouple: number; toolTransport: number }> = {
  'CDMX': { perDiemPersonDay: 0, transportCouple: 0, toolTransport: 0 },
  'GUADALAJARA': { perDiemPersonDay: 750, transportCouple: 15000, toolTransport: 15000 },
  'MONTERREY': { perDiemPersonDay: 950, transportCouple: 7700, toolTransport: 10000 },
  // ... (Agrega el resto de datos de instalación aquí)
};

export const INSTALLATION_BASE_COSTS: Record<number, { small: number, large: number }> = {
  2: { small: 33000, large: 35000 },
  3: { small: 33000, large: 35000 },
  4: { small: 33000, large: 35000 },
  5: { small: 35000, large: 37500 },
  6: { small: 42000, large: 45000 },
  // ... (Agrega el resto de niveles hasta 35)
};

export const INSTALLATION_TIME_TABLE = [
  { max: 5, tur: 5, chi: 10 },
  { max: 10, tur: 7, chi: 12 },
  { max: 15, tur: 9, chi: 14 },
  { max: 20, tur: 11, chi: 16 },
  { max: 25, tur: 13, chi: 18 },
  { max: 35, tur: 15, chi: 20 },
];

export const STANDARD_PHASES: ProjectPhase[] = [
  { id: 'p1', name: 'Firma de Contrato', baseDuration: 1, color: 'bg-blue-500' },
  { id: 'p2', name: 'Diseño Guías Mecánicas', baseDuration: 0.5, color: 'bg-blue-400' },
  { id: 'p3', name: 'Fabricación', baseDuration: 8, color: 'bg-indigo-500', isVariable: true },
  { id: 'p4', name: 'Transporte', baseDuration: 7, color: 'bg-indigo-400' },
  { id: 'p5', name: 'Importación', baseDuration: 2, color: 'bg-purple-500' },
  { id: 'p6', name: 'Verificación y Control', baseDuration: 1.5, color: 'bg-purple-400' },
  { id: 'p7', name: 'Envío a Obra', baseDuration: 0.6, color: 'bg-orange-500' },
  { id: 'p8', name: 'Instalación', baseDuration: 4, color: 'bg-yellow-500', isVariable: true }, 
  { id: 'p9', name: 'Acabados', baseDuration: 1, color: 'bg-yellow-400' },
  { id: 'p10', name: 'Verificación Pagos', baseDuration: 0.5, color: 'bg-green-500' },
  { id: 'p11', name: 'Entrega Final', baseDuration: 0.5, color: 'bg-green-600' },
];

export const INITIAL_FORM_STATE: QuoteData = {
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
  travel: 18000,
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

export const SEED_QUOTES: QuoteData[] = [
  { ...INITIAL_FORM_STATE, id: 101, clientName: 'Desarrolladora Vertical', projectRef: 'ALAM-PROY-0001', status: 'Sincronizado', quantity: 2, model: 'MRL-G', currentStage: 'ingenieria' },
];

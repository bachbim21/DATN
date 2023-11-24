import { EquipmentStatus } from './equipment.type';

export interface StatisticDashboard {
  countByDepartment: CountEquipmentByDepartment[];
  countByRiskLevels: CountEquipmentByRiskLevel[];
  countByEquipmentStatuses: CountEquipmentByStatus[];
  countRepairingByDepartment: CountEquipmentByDepartment[];
  countBrokenByDepartment: CountEquipmentByDepartment[];
}
export interface CountEquipmentByDepartment {
  departmentId: number;
  departmentName: string;
  count: number;
}
export interface CountEquipmentByRiskLevel {
  riskLevel: string;
  count: number;
}
export interface CountEquipmentByStatus {
  status: EquipmentStatus;
  count: number;
  image?: any; //image url for frontend (not response from backend)
}

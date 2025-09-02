export interface Course {
  id: number;
  code: string;
  title: string;
  description: string;
  semester: string;
  scheduleInfo: string;
  capacity: number;
  availableSeats: number;
  professor?: {
    id: number;
    name: string;
    email: string;
    department: string;
  };
}

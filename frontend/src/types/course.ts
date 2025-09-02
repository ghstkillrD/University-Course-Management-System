export interface Course {
  id: number;
  code: string;
  title: string;
  description?: string;
  semester: string;
  scheduleInfo?: string;
  capacity: number;
  availableSeats: number;
  professor?: {
    id: number;
    user: {
      name: string;
      email: string;
    };
  };
}

export class LogDto {
  user: string;
  date: Date;
  aircraftRegistration: string;
  aircraftType: string;
  pm?: {
    name?: string,
    duty?: string
  };
  from: string;
  to: string;
  startBlock: string;
  endBlock: string;
  totalTime: string;
  aircraft: string;
  dayTime: string;
  remarks?: string;
} 
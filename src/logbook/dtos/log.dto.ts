export class LogDto {
  date: Date;
  aircraft: {
    registration: string,
    model: string,
    type: string
  };
  pic: {
    email?: string,
    duty?: string
  };
  pm?: {
    name?: string,
    duty?: string
  };
  from: string;
  to: string;
  time: {
    start: string,
    end: string,
    nextDay: boolean,
    total?: string,
    dayTime: string
  };
  remarks?: string;
} 
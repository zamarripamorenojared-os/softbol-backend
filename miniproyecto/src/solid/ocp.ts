export interface TaskCostData {
  estimatedHours: number;
}

export interface ICostCalculator {
  calculateCost(task: TaskCostData): number;
}

export class StandardCostCalculator implements ICostCalculator {
  calculateCost(task: TaskCostData): number {
    return task.estimatedHours * 50;
  }
}

export class UrgentCostCalculator implements ICostCalculator {
  calculateCost(task: TaskCostData): number {
    return task.estimatedHours * 50 * 1.5; // Recargo del 50% por urgencia
  }
}

export class TaskCostService {
  constructor(private readonly calculator: ICostCalculator) {}

  processCost(task: TaskCostData): number {
    return this.calculator.calculateCost(task);
  }
}

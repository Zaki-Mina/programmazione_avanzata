import { Router } from "express";
import { Mediator } from "../interfaces/mediatorInterface";

export default abstract class BaseController {
  public abstract router: Router; // 
  protected mediator!: Mediator;

  public setMediator(mediator: Mediator) {
    this.mediator = mediator;
  }
}

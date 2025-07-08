import { Router } from "express";
import { Mediator } from "../interfaces/mediatorInterface";
//Classe astratta base
export default abstract class BaseController {
  public abstract router: Router; 
  protected mediator!: Mediator; //per la comunicazione con il mediator

  public setMediator(mediator: Mediator) {
    this.mediator = mediator; // Metodo per iniettare il mediator
  }
}

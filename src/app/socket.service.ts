import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import * as socketIo from 'socket.io-client';
import { TransactionPhase, Transactions, Property } from './model';

 const SERVER_URL = 'http://localhost:4000';
//const SERVER_URL = 'http://192.168.43.220:4000'

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket;

    public initSocket(): void {
        this.socket = socketIo(SERVER_URL);
    }

    public send(message: any): void {
        this.socket.emit('message', message);
    }

    public onTp(): Observable<TransactionPhase> {
        return new Observable<TransactionPhase>(observer => {
            this.socket.on('tp', (data) => observer.next(data));
        });
    }
    public onTps(): Observable<TransactionPhase[]> {
      return new Observable<TransactionPhase[]>(observer => {
          this.socket.on('tps', (data) => observer.next(data));
      });
  }
  public onProperties(): Observable<Property[]> {
    return new Observable<Property[]>(observer => {
        this.socket.on('properties', (data) => observer.next(data));
    });
}
  public onTids(): Observable<Transactions[]> {
    return new Observable<Transactions[]>(observer => {
        this.socket.on('tids', (data) => observer.next(data));
    });
}

    public onEvent(event: Event): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on(event, () => observer.next());
        });
}
}

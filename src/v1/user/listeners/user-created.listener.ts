import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from '../events/user-created.event';

@Injectable()
export class UserCreatedListener {
    @OnEvent('user.created')
    handleOrderCreatedEvent(event: UserCreatedEvent) {
        // handle and process "OrderCreatedEvent" event
        console.log("handling ['order.created']");
        console.log(event);
    }
}
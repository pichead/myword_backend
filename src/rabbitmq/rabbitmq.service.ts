// src/rabbitmq/rabbitmq.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { env } from 'utils/constant';
import amqp, { ChannelWrapper, AmqpConnectionManager } from 'amqp-connection-manager';
import { Channel, ConsumeMessage } from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
    private connection: AmqpConnectionManager;
    private channelWrapper: ChannelWrapper;

    async onModuleInit() {
        // เชื่อมต่อกับ RabbitMQ
        this.connection = amqp.connect([env.rmqURL]);

        // สร้าง ChannelWrapper และตรวจสอบ Queue
        this.channelWrapper = this.connection.createChannel({
            setup: async (channel: Channel) => {
                // ตรวจสอบให้แน่ใจว่า Queue ถูกสร้างขึ้น
                await channel.assertQueue('user_queue', { durable: true });
                await channel.assertQueue('email_queue', { durable: true });
                await channel.assertQueue('task_queue', { durable: true });
            },
        });
    }

    async sendToQueue(queue: string, message: any) {
        // ส่งข้อความไปที่ Queue
        await this.channelWrapper.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    }

    async consume(queue: string, callback: (msg: ConsumeMessage) => void) {
        // ตั้งค่า Consumer สำหรับ Queue ที่ระบุ
        await this.channelWrapper.addSetup(async (channel: Channel) => {
            await channel.consume(queue, (msg) => {
                if (msg !== null) {
                    callback(msg);
                    channel.ack(msg);
                }
            });
        });
    }

    async onModuleDestroy() {
        await this.channelWrapper.close();
        await this.connection.close();
        console.log('RabbitMQ Connection Closed');
    }
}

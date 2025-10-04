"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublishMessage = PublishMessage;
exports.SubscribeMessage = SubscribeMessage;
function PublishMessage(channel, key, message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield channel.publish(process.env.EXCHANGE_NAME, key, Buffer.from(message));
        }
        catch (error) {
            throw error;
        }
    });
}
function SubscribeMessage(channel, queueName, service, key) {
    return __awaiter(this, void 0, void 0, function* () {
        const appQueue = yield channel.assertQueue(queueName);
        channel.bindQueue(appQueue.queue, process.env.EXCHANGE_NAME, key);
        channel.consume(appQueue.queue, data => {
            console.log("received data", data === null || data === void 0 ? void 0 : data.content.toString());
        });
    });
}

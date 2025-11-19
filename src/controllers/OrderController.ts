import { FastifyRequest, FastifyReply } from 'fastify';
import { OrderService } from '../services/OrderService';

class OrderController {
    constructor(private orderService: OrderService) {}

    async executeOrder(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { tokenIn, tokenOut, amount, orderType = 'market' } = request.body as any;
            if (!tokenIn || !tokenOut || !amount) {
                return reply.status(400).send({ error: 'Missing required fields: tokenIn, tokenOut, amount', });
            }
            console.log(`📝 New order submission: ${tokenIn} -> ${tokenOut}, amount: ${amount}`);
            const orderId = await this.orderService.submitOrder({ tokenIn, tokenOut, amount, orderType, });
            return reply.status(202).send({ orderId, status: 'pending', wsEndpoint: `/ws/orders/${orderId}`, });
        } catch (error: any) {
            return reply.status(500).send({ error: error.message });
        }
    }

    async getOrderStatus(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { orderId } = request.params as { orderId: string }; 
            const order = await this.orderService.getOrder(orderId);
            return reply.send(order);
        } catch (error: any) {
            return reply.status(404).send({ error: error.message });
        }
    }

    async handleWebSocketUpgrade(socket: any, req: any) {
        const orderId = req.params.orderId;
        console.log(`🔗 WebSocket connected for order: ${orderId}`);
        socket.send(JSON.stringify({ type: 'connection', message: `Connected to order ${orderId}`, timestamp: new Date().toISOString(), }));

        const statusUpdates = ['pending', 'routing', 'building', 'submitted', 'confirmed'];
        for (const status of statusUpdates) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            socket.send(JSON.stringify({ type: 'status', orderId, status, timestamp: new Date().toISOString(), }));
        }

        socket.send(JSON.stringify({ type: 'execution', orderId, executedPrice: 1.45 + Math.random() * 0.1, txHash: `MOCK_TX_${Date.now()}`, timestamp: new Date().toISOString(), }));
        socket.close();
    }
}

export default OrderController;
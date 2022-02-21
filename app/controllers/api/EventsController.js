// const events = require('events');
//
// const ordersEvents = new events.EventEmitter();

const UPDATE_ORDER = "UPDATE_ORDER"
const NEW_ORDERS = "NEW_ORDERS"


let sseclients = []

class EventsController {

    eventsHandler = (req, res) => {
        const headers = {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache'
        };
        res.writeHead(200, headers);

        const clientId = Date.now();

        const newClient = {
            id: clientId,
            res
        };

        sseclients.push(newClient);

        req.on('close', () => {
            sseclients = sseclients.filter(client => client.id !== clientId);
            res.end();
        });
    }

    notifyAllSubscriber = (event = {}) => {
        sseclients.forEach(client => {
            client.res.write(EventsController.prepareSSE(event))
        })
    }

    emit = (event) => {
        this.notifyAllSubscriber(event)
    }

    static prepareSSE = (obj) => {
        let response = ''

        if (obj.event !== undefined) {
            response += "event: " + String(obj.event) + "\n"
        }
        if (obj.retry !== undefined) {
            response += "retry: " + String(obj.retry) + "\n"
        }

        response += "data: " + JSON.stringify(obj) + "\n"

        if (obj.id !== undefined) {
            response += "id: " + String(obj.id) + "\n"
        }
        return response + "\n"
    }
}

module.exports = new EventsController()

//Думаю треба змінити архітектурно підписку через ф-цію emit
//Викличемо ф-цію яка сама заемітить подію

import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from "dotenv";
import { getAllContacts, getContactById } from './services/contacts.js'

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

export const setupServer = async () => {
    const app = express();

    app.use(express.json());
    app.use(cors());

    app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

    app.get('/contacts', async(req, res) => {
        const contacts = await getAllContacts();
        res.status(200).json({
            data: contacts,
        })
    });

    app.get('/contacts/:contactId', async(req, res) => {
        const {contactId} = req.params
        const contact = await getContactById(contactId);

        if(!contact){
            return res.status(404).json({
                message: 'Contact not found',
            })
        }

        res.status(200).json({
            data: contact,
    });
    });

    // app.use('*', (req, res, next) => {
    //     res.status(404).json({
    //         message: 'Not found',
    //     });
    // });

    app.listen(PORT, () => {
	    console.log(`Server is running on port ${PORT}`);
	});
}

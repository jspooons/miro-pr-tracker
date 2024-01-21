'use server'

import axios from 'axios';
import {NextApiRequest, NextApiResponse} from 'next';

import { validateStringParam } from '../../utils/utility';
import prisma from '../../modules/db';


export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    if (request.method === 'GET') {

    } else if (request.method === 'POST') {

    } else if (request.method === 'DELETE'){
        
    } else {
        response.status(405).end();
    }
}
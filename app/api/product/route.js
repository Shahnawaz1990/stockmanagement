import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
    // Replace the uri string with your connection string.
    // const uri = "mongodb+srv://mongodb:lhcnVIXb5RORctnt@cluster0.m7zfzzf.mongodb.net/";
    const uri = "enter_mongo_conn_string";
    const client = new MongoClient(uri);
        try {
            const database = client.db('stock');
            const inventory = database.collection('inventory');
            const query = { };
            const products = await inventory.find(query).toArray();
            // console.log(products);
            return NextResponse.json({success: true, products})
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }   
}

export async function POST(request) {
    // Replace the uri string with your connection string.

    let body = await request.json()
    // console.log(body);
    // const uri = "mongodb+srv://mongodb:lhcnVIXb5RORctnt@cluster0.m7zfzzf.mongodb.net/";
    const uri = "enter_mongo_conn_string";
    const client = new MongoClient(uri);
        try {
            const database = client.db('stock');
            const inventory = database.collection('inventory');
            const query = {};
            const product = await inventory.insertOne(body)
            // console.log(product);
            return NextResponse.json({product, ok: true})
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }   
}

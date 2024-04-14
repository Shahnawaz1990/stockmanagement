import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {


    // Replace the uri string with your connection string.
    // const uri = "mongodb+srv://mongodb:lhcnVIXb5RORctnt@cluster0.m7zfzzf.mongodb.net/";
    const uri = "enter_mongo_conn_string";

    const client = new MongoClient(uri);

    
        try {
            const database = client.db('shahnawaz');
            const movies = database.collection('inventory');

            // Query for a movie that has the title 'Back to the Future'
            const query = {};
            const movie = await movies.findOne(query);

            console.log(movie);
            return NextResponse.json({ "a": 34, movie })
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }
    
    run().catch(console.dir);
}
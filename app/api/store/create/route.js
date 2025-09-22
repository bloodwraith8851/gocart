import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import imagekit from "@/configs/imageKit";
import { NextResponse } from "next/server";


// API to create a store for a user
export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const formData = await request.formData()

        const name = formData.get('name')
        const username = formData.get('username')
        const description = formData.get('description')
        const email = formData.get('email')
        const contact = formData.get('contact')
        const address = formData.get('address')
        const image = formData.get('image')

//Check for missing information

        if(!name || !username || !description || !email || !contact || !address || !image) {
            return NextResponse.json({error: "missing store information"}, {status: 400})
        }

//Check if store already exists

        const store = await prisma.store.findFirst({
            where: {
                userId: userId
            }
        })
        
        if(store) {
            return NextResponse.json({status: store.status})
        }

//Check if username is taken

        const isUsernameTaken = await prisma.store.findFirst({
            where: {
                username: username.toLowerCase()
            }
        })

        if(isUsernameTaken) {
            return NextResponse.json({error: "username is taken"}, {status: 400})
        }

// Upload image to ImageKit

        const buffer = Buffer.from(await image.arrayBuffer());
        const response = await imagekit.upload({
            file: buffer,
            fileName: image.name,
            folder: "logos"
        })

        const optimizedImage = imagekit.url({
            path: response.filePath,
            transforms: [
                {quality: 'auto'},
                {format: 'webp'},
                {height: '512'},
                
            ]
        })

//Create store

        const newStore = await prisma.store.create({
            data: {
                userID,
                name,
                description,
                username: username.toLowerCase(),
                email,
                contact,
                address,
                logo: optimizedImage,
            }
        })

//Link store to user

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                store: { connect: { id: newStore.id } }
            }
        })

        return NextResponse.json({message: "applied, waiting for approval"})
        
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: error.code || error.message }, {status: 400});
    }
}

// CHECK IS USER HAVE ALREADY REGISTERD A STORE  IF YES THEN SEND STATUS TO STORE

export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        const store = await prisma.store.findFirst({
            where: {
                userId: userId
            }
        })

        if(store) {
            return NextResponse.json({status: store.status})
        }

        return NextResponse.json({status: "not registered"})

    } catch (error) {
        console.error(error);
        return NextResponse.json({error: error.code || error.message }, {status: 400});
    }
}
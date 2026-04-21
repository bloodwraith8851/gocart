import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import imagekit from "@/configs/imageKit";
import { NextResponse } from "next/server";

// PATCH — update store profile (name, description, email, contact, address, logo)
export async function PATCH(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Verify store belongs to this user
        const existing = await prisma.store.findFirst({ where: { userId } });
        if (!existing) return NextResponse.json({ error: "No store found" }, { status: 404 });

        const formData    = await request.formData();
        const name        = formData.get("name");
        const description = formData.get("description");
        const email       = formData.get("email");
        const contact     = formData.get("contact");
        const address     = formData.get("address");
        const image       = formData.get("image"); // optional new logo

        if (!name || !description || !email || !contact || !address) {
            return NextResponse.json({ error: "Please fill in all fields" }, { status: 400 });
        }

        let logo = existing.logo; // keep existing logo by default

        // If a new image was uploaded, replace it
        if (image && image instanceof Blob && image.size > 0) {
            const buffer   = Buffer.from(await image.arrayBuffer());
            const response = await imagekit.upload({
                file:     buffer,
                fileName: image.name || "logo.jpg",
                folder:   "logos",
            });
            logo = imagekit.url({
                path: response.filePath,
                transforms: [
                    { quality: "auto" },
                    { format: "webp" },
                    { height: "512" },
                ],
            });
        }

        const updated = await prisma.store.update({
            where: { userId },
            data:  { name, description, email, contact, address, logo },
        });

        return NextResponse.json({ store: updated, message: "Store updated successfully" });

    } catch (error) {
        console.error("[/api/store/update]", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// GET — return current store info for the settings form
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const store = await prisma.store.findFirst({ where: { userId } });
        if (!store) return NextResponse.json({ error: "No store found" }, { status: 404 });

        return NextResponse.json({ store });
    } catch (error) {
        console.error("[/api/store/update GET]", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

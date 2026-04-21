// Run: node scripts/get-my-clerk-id.js
// This will list all users from your Clerk account so you can find your admin user ID.

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY || "sk_test_Y8zDasJ5rgTmDawvKiuTWjSAqRcw34cH7mgi1p2a1M";

async function getUsers() {
    const resp = await fetch("https://api.clerk.com/v1/users?limit=20&order_by=-created_at", {
        headers: {
            Authorization: `Bearer ${CLERK_SECRET_KEY}`,
            "Content-Type": "application/json",
        },
    });

    if (!resp.ok) {
        console.error("Error:", resp.status, await resp.text());
        return;
    }

    const users = await resp.json();
    console.log("\n=== Clerk Users ===\n");
    users.forEach((u, i) => {
        const email = u.email_addresses?.[0]?.email_address || "no email";
        console.log(`[${i + 1}] ID: ${u.id}`);
        console.log(`    Name:  ${u.first_name || ""} ${u.last_name || ""}`.trim());
        console.log(`    Email: ${email}`);
        console.log(`    Created: ${new Date(u.created_at).toLocaleString()}`);
        console.log("");
    });
    console.log("===================");
    console.log("Copy your User ID (starts with user_...) and add it to .env:");
    console.log('  ADMIN_USER_ID=user_xxxxxxxxxxxxxxxx');
    console.log('  NEXT_PUBLIC_ADMIN_USER_ID=user_xxxxxxxxxxxxxxxx');
}

getUsers().catch(console.error);

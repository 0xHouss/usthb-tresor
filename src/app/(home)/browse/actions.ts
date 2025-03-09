"use server";

import { drive } from "@/lib/google-drive";


export async function getDriveFiles() {
    try {
        const response = await drive.files.list({
            q: "'1KYAYbyYJhCtjhTCz7j3XUr2UBG0uNuw4' in parents",
            pageSize: 50,
            fields: "files(id, name, mimeType, webViewLink, webContentLink)",
        });

        return response.data.files || [];
    } catch (error) {
        console.error("Failed to fetch files:", error);
        return [];
    }
}


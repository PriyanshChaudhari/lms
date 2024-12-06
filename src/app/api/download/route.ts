import { NextRequest, NextResponse } from "next/server";

// Define MIME type mapping
const mimeTypes: Record<string, string> = {
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
};

/**
 * Determine content type based on file extension.
 * @param url - The file URL.
 * @returns The corresponding MIME type or a fallback.
 */
function getContentTypeFromExtension(url: string): string {
    const extension = url.split(".").pop()?.toLowerCase();
    return extension ? mimeTypes[extension] || "application/octet-stream" : "application/octet-stream";
}

function getExtensionFromUrl(url: string): string | null {
    const parts = url.split('/').pop()?.split('?')[0]; // Get the last part of the URL before query params
    if (parts) {
        const extension = parts.split('.').pop(); // Get the extension from the last part
        return extension || null; // Return null if no extension is found
    }
    return null;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get("url"); // Expecting full URL

    if (!fileUrl) {
        return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    try {
        const response = await fetch(fileUrl);

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch the file" }, { status: 500 });
        }

        // Infer content type from the fetched response or file extension
        const contentType = response.headers.get("content-type") || getContentTypeFromExtension(fileUrl);

        // Get the file extension for the filename
        const fileExtension = getExtensionFromUrl(fileUrl)
        const fileName = `downloaded_file.${fileExtension}`;

        const fileBuffer = await response.arrayBuffer();

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Disposition": `attachment; filename="${fileName}"`,
                "Content-Type": contentType,
            },
        });
    } catch (error) {
        console.error("Error fetching file:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

import Link from "next/link";
import { getFiles } from "./actions";

export default async function DriveFilesPage() {
    const files = await getFiles();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Google Drive Files</h1>

            {files.length === 0 ? (
                <p>No files found.</p>
            ) : (
                <ul className="border rounded-lg p-4">
                    {files.map((file) => (
                        <li key={file.id} className="mb-2 border-b pb-2">
                            <p className="font-medium">{file.module}</p>
                            <Link
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                View File
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

import { getDriveFiles } from "./actions";

export default async function DriveFilesPage() {
    const files = await getDriveFiles();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Google Drive Files</h1>

            {files.length === 0 ? (
                <p>No files found.</p>
            ) : (
                <ul className="border rounded-lg p-4">
                    {files.map((file) => (
                        <li key={file.id} className="mb-2 border-b pb-2">
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-gray-500">{file.mimeType}</p>
                            {file.webViewLink && (
                                <a
                                    href={file.webViewLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    View File
                                </a>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

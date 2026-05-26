import { NextResponse } from "next/server";
import { spawn } from "node:child_process";

export const dynamic = "force-dynamic";

export async function POST(): Promise<Response> {
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Not available in production" }, { status: 403 });
    }

    return new Promise<Response>((resolve) => {
        const processRef = spawn("npm", ["run", "db:seed"], {
            cwd: process.cwd(),
            shell: true,
        });

        let stdout = "";
        let stderr = "";

        processRef.stdout.on("data", (chunk) => {
            stdout += chunk.toString();
        });

        processRef.stderr.on("data", (chunk) => {
            stderr += chunk.toString();
        });

        processRef.on("close", (code) => {
            if (code === 0) {
                resolve(NextResponse.json({ ok: true, output: stdout.trim() }));
            } else {
                resolve(
                    NextResponse.json(
                        { error: "Seed failed", output: stderr || stdout },
                        { status: 500 },
                    ),
                );
            }
        });
    });
}

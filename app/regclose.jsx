"use client";

const RegistrationClosed = () => {
    return (
        <main
            style={{
                minHeight: "100vh",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#000",
                color: "#fff",
                textAlign: "center",
            }}
        >
            <div>
                <h1
                    style={{
                        fontSize: "48px",
                        fontWeight: "700",
                        marginBottom: "16px",
                    }}
                >
                    Registration Closed
                </h1>

                <p
                    style={{
                        fontSize: "20px",
                        color: "#aaa",
                    }}
                >
                    Registration for this event is now closed.
                </p>
            </div>
        </main>
    );
};

export default RegistrationClosed;

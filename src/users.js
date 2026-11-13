
 // 4 хэрэглэгчийн мэдээлэл
export const users = [
    {
        id: 1,
        name: "Bat",
        email: "bat@example.com",
        role: "ADMIN",
        password: "example1"
    },
    {
        id: 2,
        name: "Bold",
        email: "bold@example.com",
        role: "USER",
        password: "example2"
    },
    {
        id: 3,
        name: "Saraa",
        email: "saraa@example.com",
        role: "USER",
        password: "example3"
    },
    {
        id: 4,
        name: "Anu",
        email: "anu@example.com",
        role: "ADMIN",
        password: "example4"
    }
];

// ID-аар хэрэглэгч хайх
export function findUserById(id) {
    return users.find((user) => user.id === id);
}

// Email-аар хэрэглэгч хайх
export function findByEmail(email) {
    return users.find((user) =>
        user.email.toLowerCase() === email.toLowerCase()
    );
}

// ADMIN хэрэглэгчдийн тоог олох
export function countAdmins() {
    return users.filter(
        (user) => user.role === "ADMIN"
    ).length;
}


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

// Шинэ хэрэглэгчийн ID
let nextId = 5;

// ID-аар хэрэглэгч хайх
export function findUserById(id) {
    return users.find(user => user.id === id);
}

// Email-аар хэрэглэгч хайх
export function findByEmail(email) {
    return users.find(user =>
        user.email.toLowerCase() === email.toLowerCase()
    );
}

// ADMIN хэрэглэгчдийн тоог олох
export function countAdmins() {
    return users.filter(
        user => user.role === "ADMIN"
    ).length;
}

// Шинэ хэрэглэгч нэмэх
export function addUser(input) {
    const user = {
        id: nextId++,
        role: "USER",
        ...input
    };

    users.push(user);
    return user;
}

// Хэрэглэгчийн мэдээлэл засах
export function updateUser(id, changes) {
    const user = findUserById(id);

    // Хэрэглэгч олдохгүй бол null буцаах
    if (!user) return null;

    const { name, email, role } = changes;

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role;

    return user;
}

// Хэрэглэгч устгах
export function removeUser(id) {
    const index = users.findIndex(
        user => user.id === id
    );

    // Хэрэглэгч олдохгүй бол false буцаах
    if (index === -1) return false;

    users.splice(index, 1);
    return true;
}

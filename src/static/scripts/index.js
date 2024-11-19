async function loadUserInfo() {
    try {
        const response = await fetch("/users/me");
        if (response.ok) {
            const user = await response.json();
            document.getElementById("userName").textContent = user.username;
        } else {
            window.location.href = "/login";
        }
    } catch (error) {
        console.error(error);
        alert("Network error while loading user information.");
    }
}

async function loadUserWeapons() {
    try {
        const response = await fetch('/users/weapons');
        if (response.ok) {
            const userWeapons = await response.json();
            const userWeaponsList = document.getElementById("userWeaponsList");
            userWeaponsList.innerHTML = "";

            if (userWeapons.length === 0) {
                userWeaponsList.innerHTML = "<li class='list-group-item'>No weapons found.</li>";
                return;
            }

            userWeapons.forEach((userWeapon) => {
                const listItem = document.createElement("li");
                listItem.classList.add("list-group-item");
                listItem.textContent = `${userWeapon.weapon_name} (x${userWeapon.count})`;
                userWeaponsList.appendChild(listItem);
            });
        }
    } catch (error) {
        console.error(error);
        alert("Network error while loading user's weapons.");
    }
}

async function loadAvailableWeapons() {
    try {
        const response = await fetch('/weapons?limit=100&offset=0');
        if (response.ok) {
            const availableWeapons = await response.json();
            const availableWeaponsList = document.getElementById("availableWeaponsList");
            availableWeaponsList.innerHTML = "";

            availableWeapons.forEach((weapon) => {
                const listItem = document.createElement("li");
                listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
                listItem.innerHTML = `
                    ${weapon.name} - ${weapon.description} (${weapon.damage} dmg, $${weapon.price})
                    <button class="btn btn-primary btn-sm" onclick="buyWeapon(${weapon.id})">Buy</button>
                `;
                availableWeaponsList.appendChild(listItem);
            });
        }
    } catch (error) {
        console.error(error);
        alert("Network error while loading available weapons.");
    }
}

async function buyWeapon(weaponId) {
    const count = prompt("Enter the quantity to buy:", "1");
    if (!count || isNaN(count) || count <= 0) {
        alert("Invalid quantity.");
        return;
    }

    try {
        const response = await fetch(`/weapons/${weaponId}/buy`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ count: parseInt(count, 10) }),
        });

        if (response.ok) {
            loadUserWeapons();
        } else {
            alert("Failed to purchase weapon.");
        }
    } catch (error) {
        console.error(error);
        alert("Network error while purchasing weapon.");
    }
}

document.getElementById("logoutButton").addEventListener("click", async () => {
    try {
        const response = await fetch("/users/logout", {
            method: "POST",
            credentials: "include"
        });

        if (response.ok) {
            window.location.href = "/login";
        } else {
            alert("Failed to log out.");
        }
    } catch (error) {
        console.error("Logout error:", error);
        alert("Network error.");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    loadUserInfo();
    loadUserWeapons();

    document.getElementById("loadAvailableWeapons").addEventListener("click", loadAvailableWeapons);
    loadAvailableWeapons();
});

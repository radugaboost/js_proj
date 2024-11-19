document.getElementById("addWeaponForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const damage = document.getElementById("damage").value;
    const price = document.getElementById("price").value;

    try {
        const response = await fetch("/weapons", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, description, damage, price }),
        });

        if (response.ok) {
            alert("Weapon added successfully!");
            await loadWeapons();
        } else {
            alert("Error adding weapon!");
        }
    } catch (error) {
        console.error(error);
        alert("Network error");
    }
});

async function deleteWeapon(weaponId) {
    if (!confirm("Are you sure you want to delete this weapon?")) return;

    try {
        const response = await fetch(`/weapons/${weaponId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Weapon deleted successfully!");
            await loadWeapons();
        } else {
            alert("Error deleting weapon!");
        }
    } catch (error) {
        console.error(error);
        alert("Network error");
    }
}

document.getElementById("updateWeaponForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const weaponId = document.getElementById("updateWeaponId").value;
    const name = document.getElementById("updateName").value;
    const description = document.getElementById("updateDescription").value;
    const damage = document.getElementById("updateDamage").value;
    const price = document.getElementById("updatePrice").value;

    try {
        const response = await fetch(`/weapons/${weaponId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, description, damage, price }),
        });

        if (response.ok) {
            alert("Weapon updated successfully!");
            await loadWeapons();
            const updateWeaponModal = bootstrap.Modal.getInstance(document.getElementById("updateWeaponModal"));
            updateWeaponModal.hide();
        } else {
            alert("Error updating weapon!");
        }
    } catch (error) {
        console.error(error);
        alert("Network error");
    }
});

async function loadWeapons() {
    try {
        const response = await fetch("/weapons?limit=100&offset=0");
        if (response.ok) {
            const weapons = await response.json();
            const weaponList = document.getElementById("weaponList");
            weaponList.innerHTML = "";
            weapons.forEach((weapon) => {
                const listItem = document.createElement("li");
                listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
                listItem.innerHTML = `
                    ${weapon.name} - ${weapon.description} (${weapon.damage} dmg, $${weapon.price})
                    <div>
                        <button class="btn btn-warning btn-sm me-2" onclick="openUpdateModal(${weapon.id}, '${weapon.name}', '${weapon.description}', ${weapon.damage}, ${weapon.price})">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteWeapon(${weapon.id})">Delete</button>
                    </div>
                `;
                weaponList.appendChild(listItem);
            });
        } else {
            alert("Error loading weapons!");
        }
    } catch (error) {
        console.error(error);
        alert("Network error");
    }
}

function openUpdateModal(id, name, description, damage, price) {
    document.getElementById("updateWeaponId").value = id;
    document.getElementById("updateName").value = name;
    document.getElementById("updateDescription").value = description;
    document.getElementById("updateDamage").value = damage;
    document.getElementById("updatePrice").value = price;

    const updateWeaponModal = new bootstrap.Modal(document.getElementById("updateWeaponModal"));
    updateWeaponModal.show();
}

document.getElementById("loadWeapons").addEventListener("click", loadWeapons);
loadWeapons();

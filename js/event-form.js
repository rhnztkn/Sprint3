import { events } from "./data.js";

const form = document.querySelector("#etkinlik-formu");
const mesajKutusu = document.querySelector("#form-mesaj");

if (form) {
    // Eğer güncelleme sayfasındaysak formun içini doldur
    if (form.dataset.mode === "guncelle") {
        const id = new URLSearchParams(location.search).get("id");
        const etkinlik = events.find((e) => e.id === id);

        if (!etkinlik) {
            form.outerHTML = `
                <div style="border: 2px solid red; padding: 20px; color: red;">
                    <h2>Güncellenecek etkinlik seçilmedi.</h2>
                    <p>Önce listeden bir etkinlik seçin.</p>
                    <a href="etkinlikler.html">Etkinliklere git</a>
                </div>
            `;
        } else {
            form.elements["ad"].value = etkinlik.title;
            form.elements["kategori"].value = etkinlik.category;
            form.elements["tarih"].value = etkinlik.date;
            form.elements["saat"].value = etkinlik.time;
            form.elements["yer"].value = etkinlik.location;
            form.elements["kontenjan"].value = etkinlik.capacity;
            form.elements["aciklama"].value = etkinlik.description;
        }
    }

    // Form Gönderimi
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Eski hataları temizle
        document.querySelectorAll("[aria-invalid='true']").forEach(el => el.removeAttribute("aria-invalid"));
        document.querySelectorAll(".hata-mesaji").forEach(el => el.textContent = "");

        const fd = new FormData(form);
        const data = {
            id: form.dataset.mode === "guncelle" ? new URLSearchParams(location.search).get("id") : `event-${Date.now()}`,
            title: fd.get("ad").trim(),
            category: fd.get("kategori"),
            date: fd.get("tarih"),
            time: fd.get("saat"),
            location: fd.get("yer").trim(),
            capacity: fd.get("kontenjan") ? Number(fd.get("kontenjan")) : null,
            description: fd.get("aciklama").trim()
        };

        const errors = {};

        // Kurallar
        if (data.title.length < 3) errors.ad = "Etkinlik adı en az 3 karakter olmalı.";
        if (!data.category) errors.kategori = "Bir kategori seçin.";
        if (!data.date) errors.tarih = "Tarih seçin.";
        if (!data.time) errors.saat = "Saat seçin.";
        if (!data.location) errors.yer = "Yer bilgisini yazın.";
        if (data.capacity !== null && (data.capacity < 1 || data.capacity > 1000)) errors.kontenjan = "Kontenjan 1-1000 arası olmalıdır.";

        // Hata Varsa
        if (Object.keys(errors).length > 0) {
            for (const key in errors) {
                const alan = form.elements[key];
                if (alan) {
                    alan.setAttribute("aria-invalid", "true");
                    const hataYeri = document.querySelector(`#${key}-hata`);
                    if (hataYeri) hataYeri.textContent = errors[key];
                }
            }
            return;
        }

        // Başarılı Gönderim
        mesajKutusu.innerHTML = `
            <div style="border: 2px solid green; padding: 20px; color: green; margin-top: 20px;">
                <h3>Etkinlik ${form.dataset.mode === "guncelle" ? "güncellendi" : "oluşturuldu"} (bu sprintte kaydedilmez):</h3>
                <pre>${JSON.stringify(data, null, 2)}</pre>
            </div>
        `;
    });
}
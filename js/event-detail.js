import { events } from "./data.js";

const container = document.querySelector("#detay");
const id = new URLSearchParams(location.search).get("id");
const event = events.find((e) => e.id === id);

if (!event) {
    container.innerHTML = `
        <div style="border: 2px solid red; padding: 20px; color: red;">
            <h2>Etkinlik bulunamadı</h2>
            <p>"${id}" numaralı bir etkinlik yok. Listeden bir etkinlik seçin.</p>
            <a href="etkinlikler.html">Listeye dön</a>
        </div>
    `;
} else {
    document.title = event.title;
    const tarihDate = new Date(event.date);
    const formatliTarih = tarihDate.toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', year: 'numeric' });

    container.innerHTML = `
        <h2>${event.title}</h2>
        <div class="kunye">
            <p><strong>Tarih:</strong> ${formatliTarih}, ${event.time}</p>
            <p><strong>Yer:</strong> ${event.location}</p>
            <p><strong>Kategori:</strong> ${event.category}</p>
            <p><strong>Kontenjan:</strong> ${event.capacity} kişi</p>
        </div>
        <div class="aciklama">
            <h3>Açıklama</h3>
            <p>${event.description}</p>
        </div>
        <br>
        <a href="etkinlikler.html">Listeye dön</a> | 
        <a href="etkinlik-guncelle.html?id=${event.id}">Bu etkinliği güncelle</a>
    `;
}
fetch("https://venda-flow-xi.vercel.app/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Test User", email: "test2@test.com", password: "password123", businessName: "Test" })
}).then(async r => {
    console.log(r.status);
    console.log(await r.text());
});

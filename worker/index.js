export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact" && request.method === "POST") {
      const form = await request.formData();
      const back = (flag) =>
        Response.redirect(new URL("/Contact/?" + flag + "=1", request.url), 303);

      // Hidden spam trap: real visitors leave this empty
      if (form.get("website")) return back("sent");

      const clean = (v, max) =>
        String(v || "").replace(/[\r\n]+/g, " ").trim().slice(0, max);
      const name = clean(form.get("name"), 200);
      const email = clean(form.get("email"), 200);
      const message = String(form.get("message") || "").trim().slice(0, 5000);

      if (!name || !email || !message) return back("error");

      try {
        await env.EMAIL.send({
          to: "flemingdesignsllc@gmail.com",
          from: {
            email: "contact@flemingdesignsllc.com",
            name: "Fleming Design Studio Website",
          },
          replyTo: email,
          subject: "New message from " + name,
          text: "Name: " + name + "\nEmail: " + email + "\n\n" + message,
        });
      } catch (e) {
        return back("error");
      }
      return back("sent");
    }

    return env.ASSETS.fetch(request);
  },
};

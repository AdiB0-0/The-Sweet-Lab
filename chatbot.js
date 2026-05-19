const API_KEY = "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";
const MODEL = "google/gemini-2.0-flash-001";

const PRODUCTS = [
    { name: "Silver Kaju Katli", price: 800, cat: "Sweets", variants: ["250g", "500g", "1kg"], desc: "Premium cashew fudge with edible silver leaf" },
    { name: "Shahi Motichoor", price: 600, cat: "Sweets", variants: ["250g", "500g"], desc: "Golden gram flour pearls in pure desi ghee" },
    { name: "Royal Mysore Pak", price: 900, cat: "Sweets", variants: ["200g", "400g", "800g"], desc: "Rich, porous fudge from royal kitchens" },
    { name: "Almond Rose Peda", price: 550, cat: "Sweets", variants: ["250g", "500g"], desc: "Milk fudge with almonds and rose water" },
    { name: "Saffron Rasbhori", price: 450, cat: "Sweets", variants: ["6 pcs", "12 pcs", "24 pcs"], desc: "Cottage cheese dumplings in saffron syrup" },
    { name: "Classic Gulab Jamun", price: 400, cat: "Sweets", variants: ["6 pcs", "12 pcs", "24 pcs"], desc: "Khoya balls in cardamom sugar syrup" },
    { name: "Besan Ladoo", price: 550, cat: "Sweets", variants: ["250g", "500g", "1kg"], desc: "Roasted chickpea flour with cardamom and ghee" },
    { name: "Malai Kalakand", price: 700, cat: "Sweets", variants: ["250g", "500g"], desc: "Milk cake with pistachio topping" },
    { name: "Soan Papdi", price: 350, cat: "Sweets", variants: ["200g", "400g"], desc: "Crispy, flaky sweet with cardamom and almonds" },
    { name: "Agra Petha", price: 300, cat: "Sweets", variants: ["250g", "500g"], desc: "Translucent ash gourd candy" },
    { name: "Rajasthani Ghevar", price: 850, cat: "Sweets", variants: ["Small", "Medium", "Large"], desc: "Disc-shaped sweet with rabdi" },
    { name: "Rasmalai", price: 600, cat: "Sweets", variants: ["4 pcs", "8 pcs", "16 pcs"], desc: "Cottage cheese in saffron milk" },
    { name: "Bikaneri Bhujia", price: 250, cat: "Namkeen", variants: ["200g", "400g", "800g"], desc: "Crispy moth bean snack" },
    { name: "Moong Dal", price: 200, cat: "Namkeen", variants: ["200g", "500g"], desc: "Crunchy split green gram" },
    { name: "Navratan Mixture", price: 300, cat: "Namkeen", variants: ["250g", "500g", "1kg"], desc: "Nine ingredient savory mix" },
    { name: "Khatta Meetha", price: 220, cat: "Namkeen", variants: ["200g", "400g"], desc: "Sweet and sour sev with peas" },
    { name: "Punjabi Mathri", price: 300, cat: "Namkeen", variants: ["200g", "500g"], desc: "Flaky savory biscuits with carom" },
    { name: "Mini Dry Samosa", price: 350, cat: "Namkeen", variants: ["12 pcs", "24 pcs", "36 pcs"], desc: "Bite-sized crispy samosas" },
    { name: "Butter Chakli", price: 260, cat: "Namkeen", variants: ["200g", "400g"], desc: "Spiral savory snack with butter" },
    { name: "Diet Chivda", price: 200, cat: "Namkeen", variants: ["200g", "500g"], desc: "Roasted poha with turmeric" },
    { name: "Strawberry Truffle", price: 1200, cat: "Bakery", variants: ["500g", "1kg", "2kg"], desc: "Dark chocolate with strawberry compote" },
    { name: "Butter Cookies", price: 450, cat: "Bakery", variants: ["150g", "300g", "600g"], desc: "Artisanal butter cookies" },
    { name: "Nankhatai", price: 350, cat: "Bakery", variants: ["200g", "400g"], desc: "Traditional ghee shortbread" },
    { name: "Rich Fruit Cake", price: 800, cat: "Bakery", variants: ["500g", "1kg"], desc: "Dense cake with candied fruits and walnuts" },
    { name: "Fudge Brownie", price: 200, cat: "Bakery", variants: ["1 pc", "4 pcs", "8 pcs"], desc: "Gooey chocolate brownie with walnuts" },
    { name: "Artisan Bonbons", price: 1500, cat: "Hampers", variants: ["Box of 12", "Box of 24"], desc: "Chocolate bonbons with Indian spices" },
    { name: "The Maharaani Hamper", price: 3500, cat: "Hampers", variants: ["Standard", "Deluxe"], desc: "Premium hamper with sweets and dry fruits" },
    { name: "Corporate Elegance", price: 2200, cat: "Hampers", variants: ["10 pcs", "20 pcs", "50 pcs"], desc: "Sleek corporate gifting box" }
];

const MEMBERSHIP_TIERS = [
    { name: "Silver Craver", price: 199, discount: "5%", perks: ["5% Flat Discount", "Free Standard Delivery"] },
    { name: "Gold Connoisseur", price: 399, discount: "10%", perks: ["10% Flat Discount", "Free Express Delivery", "Early Access to Festive Sweets"] },
    { name: "Royal Platinum", price: 799, discount: "15%", perks: ["15% Flat Discount", "Free Express Delivery", "Early Access", "1 Free Premium Hamper/year", "Priority 24/7 Support"] }
];

let chatHistory = [];
let isChatOpen = false;

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const cart = getCart();
    let total = 0;
    cart.forEach(item => total += item.qty);
    
    const badges = document.querySelectorAll('.header-cart-badge, #headerCartBadge');
    badges.forEach(badge => {
        if (badge) {
            badge.textContent = total;
            badge.style.display = total > 0 ? "flex" : "none";
        }
    });
}

function addToCartFromChat(productName, quantity = 1, variant = null) {
    const cart = getCart();
    const product = PRODUCTS.find(p => p.name.toLowerCase().includes(productName.toLowerCase()));
    
    if (!product) return null;
    
    const weight = variant || (product.variants ? product.variants[0] : "Standard");
    
    const existingItem = cart.find(item => item.name === product.name && item.weight === weight);
    
    if (existingItem) {
        existingItem.qty += quantity;
    } else {
        cart.push({
            name: product.name,
            price: product.price,
            qty: quantity,
            weight: weight
        });
    }
    
    saveCart(cart);
    return { name: product.name, weight: weight, qty: quantity, price: product.price };
}

function getUserContext() {
    let user = JSON.parse(localStorage.getItem("user"));
    let mem = JSON.parse(localStorage.getItem("sweet_membership"));
    let cart = getCart();

    let context = `You are a helpful assistant for The Sweet Lab sweet shop.

IMPORTANT - YOU CAN ADD ITEMS TO CART:
When user wants to add an item, respond with a special command in this format:
ADD_TO_CART: Product Name | Quantity | Variant (optional)

Example: ADD_TO_CART: Silver Kaju Katli | 2 | 500g
Example: ADD_TO_CART: Gulab Jamun | 1 | 12 pcs

After the command, include a friendly confirmation message.

USER CONTEXT:
`;
    
    if (user) {
        context += `CURRENT USER: ${user.name} (${user.email})\n`;
    } else {
        context += `CURRENT USER: Not logged in\n`;
    }

    if (mem) {
        context += `MEMBERSHIP: ${mem.tier} tier (${mem.discount * 100}% discount)\n`;
    } else {
        context += `MEMBERSHIP: None (not a member)\n`;
    }

    context += `CART (${cart.length} items): `;
    if (cart.length === 0) {
        context += "Empty\n";
    } else {
        cart.forEach(item => {
            context += `${item.name} (${item.weight}) x${item.qty}, `;
        });
        context = context.slice(0, -2) + "\n";
    }

    context += `\nPRODUCTS AVAILABLE (with variants):\n`;
    PRODUCTS.forEach(p => {
        context += `- ${p.name}: ₹${p.price} (${p.cat}) - ${p.desc}. Available in: ${p.variants ? p.variants.join(", ") : "Standard"}\n`;
    });

    context += `\nMEMBERSHIP TIERS:\n`;
    MEMBERSHIP_TIERS.forEach(t => {
        context += `- ${t.name}: ₹${t.price}/month, ${t.discount} off, perks: ${t.perks.join(", ")}\n`;
    });

    context += `\nGuidelines:
- Be friendly and helpful
- When user asks to add something to cart, use ADD_TO_CART command
- You can add multiple items at once with separate ADD_TO_CART commands
- After adding, show the cart total items count
- Keep responses concise but friendly`;

    return context;
}

function toggleChat() {
    const chatWindow = document.getElementById("chatWindow");
    const chatBtn = document.getElementById("chatBtn");
    isChatOpen = !isChatOpen;
    chatWindow.style.display = isChatOpen ? "flex" : "none";
    chatBtn.style.display = isChatOpen ? "none" : "flex";
}

async function sendMessage() {
    const input = document.getElementById("chatInput");
    const message = input.value.trim();
    if (!message) return;

    addMessage(message, "user");
    input.value = "";

    const loading = document.getElementById("chatLoading");
    loading.style.display = "block";

    try {
        const context = getUserContext();
        chatHistory.push({ role: "user", content: message });
        
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": window.location.href,
                "X-Title": "The Sweet Lab Chatbot"
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    { role: "system", content: context },
                    ...chatHistory.slice(-10)
                ],
                max_tokens: 600
            })
        });

        const data = await response.json();
        let reply = data.choices?.[0]?.message?.content || "Sorry, I'm having trouble responding right now. Please try again!";
        
        const addCommands = reply.match(/ADD_TO_CART:.*/gi);
        if (addCommands) {
            addCommands.forEach(cmd => {
                const parts = cmd.replace(/ADD_TO_CART:/i, "").trim().split("|");
                if (parts.length >= 2) {
                    const productName = parts[0].trim();
                    const qty = parseInt(parts[1].trim()) || 1;
                    const variant = parts[2] ? parts[2].trim() : null;
                    
                    const result = addToCartFromChat(productName, qty, variant);
                    if (result) {
                        const cart = getCart();
                        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
                        reply = `✅ Added to cart!\n\n🛒 ${result.name} (${result.weight}) x${result.qty}\n\nCart now has ${totalItems} item(s). ${reply.replace(cmd, "").trim()}`;
                    }
                }
            });
        }
        
        chatHistory.push({ role: "assistant", content: reply });
        addMessage(reply, "bot");
    } catch (error) {
        addMessage("Sorry, I'm having trouble connecting. Please try again later!", "bot");
    }

    loading.style.display = "none";
}

function addMessage(text, sender) {
    const messages = document.getElementById("chatMessages");
    const div = document.createElement("div");
    div.className = `chat-message ${sender}`;
    div.innerHTML = text.replace(/\n/g, "<br>");
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

document.addEventListener("keydown", function(e) {
    if (e.key === "Enter" && document.getElementById("chatInput") === document.activeElement) {
        sendMessage();
    }
});

window.addEventListener("storage", function(e) {
    if (e.key === "cart") {
        updateCartBadge();
    }
});
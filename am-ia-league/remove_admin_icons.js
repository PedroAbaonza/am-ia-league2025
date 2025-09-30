// Script to remove all icons from admin component
const fs = require("fs");

// Read the admin component file
let content = fs.readFileSync(
  "src/app/pages/admin/admin.component.html",
  "utf8"
);

// Remove all icon spans and their content
content = content.replace(/<span class="btn-icon">[\s\S]*?<\/span>/g, "");
content = content.replace(/<div class="metric-icon">[\s\S]*?<\/div>/g, "");
content = content.replace(/<span class="card-icon">[\s\S]*?<\/span>/g, "");
content = content.replace(/<span class="message-icon">[\s\S]*?<\/span>/g, "");
content = content.replace(/<span class="error-icon">[\s\S]*?<\/span>/g, "");
content = content.replace(/<span class="privacy-icon">[\s\S]*?<\/span>/g, "");
content = content.replace(/<span class="detail-icon">[\s\S]*?<\/span>/g, "");
content = content.replace(/<span class="no-data-icon">[\s\S]*?<\/span>/g, "");

// Remove any remaining emoji icons
content = content.replace(
  /🔄|❌|✅|👁️|🔒|📊|🎯|⭐|📋|🔍|⚙️|💡|⚡|🔥|💪|🌟|🎉|🏅|📈|💻|🛠️|🎨|📝|📌|📍|🔗|🔓|⚠️|ℹ️|📅|✈️|👥|🏆|🚀|👤|🔐|🚪|🚁|💚|📥|🗑️/g,
  ""
);

// Clean up any extra whitespace
content = content.replace(/\n\s*\n\s*\n/g, "\n\n");

// Write back to file
fs.writeFileSync("src/app/pages/admin/admin.component.html", content);

console.log("All icons removed from admin component!");

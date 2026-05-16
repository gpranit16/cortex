# CORTEX 2026 | IEEE EMBS BMSIT

**CORTEX** is an ultra-premium, high-performance event command center designed for live round management and real-time visualization. Built with a cinematic "Abyss-Black" aesthetic and an integrated 3D neural network, it provides a centralized hub for timers, stages, and automated AI voice coordination.

---

## 🚀 One-Click Deployment (Vercel)
1. Import this repository into **Vercel**.
2. Select **Vite** as the framework preset.
3. Use `npm run build` for the Build Command and `dist` for the Output Directory.
4. Deploy.

---

## 🎮 Operational Manual

### **Keyboard Control System**
The dashboard is designed for high-stakes environments where mouse clicks are too slow. Use the following hardware triggers:

| Key Trigger | Action |
| :--- | :--- |
| `SPACE` | **Play / Pause** current timer |
| `RIGHT ARROW` | **Skip** to the next event stage |
| `LEFT ARROW` | **Revert** to the previous event stage |
| `SHIFT + R` | **Hard Reset** (Wipes all round progress) |
| `ESC` | Close any open HUD modals |

### **Automated AI Voice System**
The CORTEX AI voice automatically coordinates the following intervals:
- **Round Start**: Announcements of stage label and name.
- **5-Minute Warning**: "wrap up" notification.
- **1-Minute Alert**: Final conclusion warning.
- **Cycle Completion**: Automated stage transition audio.

### **Custom Broadcast Scheduling**
In the **CUSTOM BROADCAST** panel (Right HUD):
1. **Manual Trigger**: Type text and click `SPEAK NOW` for an immediate broadcast.
2. **Scheduled Trigger**: Type text, enter a target minute (e.g., `15`), and click `SCHEDULE`. The AI will automatically broadcast the message when the timer hits exactly that minute.

---

## 🛠 Tech Stack
- **Core**: React 19 + Vite (High-speed rendering)
- **Engine**: Three.js (3D Synaptic Mesh 3.0)
- **State**: Zustand (Atomic timer management)
- **Animation**: Framer Motion + GSAP (Cinematic UI flow)
- **Voice**: Web Speech API (Neural Broadcast System)

---

## 📡 Diagnostic Nodes
The system uses a triple-layered z-index architecture:
- **Base Layer**: Three.js Neural Mesh (Absolute Black background)
- **Logic Layer**: Central HUD (Timer, Stages, Round Preview)
- **Control Layer**: Sidebars (Timeline, Voice Settings, Custom Queue)

---

**CORTEX v2.0 · IEEE EMBS BMSIT · MISSION READY.**

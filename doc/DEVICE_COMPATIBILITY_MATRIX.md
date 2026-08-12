# Device & Operating System Compatibility Matrix

**NSVAIR Diagnosis Platform**  
*Powered by NSVAIR GROUP OF INDUSTRY*  
**Document Ref:** `NSV-DOC-ENG-2026-COMPAT02`  
**Version:** 1.0.0 (Release)  

---

## 1. Multi-Platform Support Overview

The NSVAIR Diagnosis platform is engineered for universal compatibility across desktop, mobile, tablet, and workstation operating systems. The automated calibration engine dynamically provisions platform-specific correction layers for each environment.

| Operating System | Supported Versions | Certified Browsers | Primary Hardware Sensors Tested | Calibration Status |
| :--- | :--- | :--- | :--- | :--- |
| **Microsoft Windows** | Windows 10, 11 (x64 / ARM64) | Chrome 110+, Edge 110+, Firefox 115+ | HD Webcam, Realtek/USB Audio, Display | ✅ **Full Support (Certified)** |
| **Apple iOS / iPadOS** | iOS 15.0 – 18.2+ | Mobile Safari, Chrome iOS, Edge iOS | TrueDepth / FaceTime HD, Triple Mic, CoreMotion | ✅ **Full Support (Certified)** |
| **Google Android** | Android 9.0 (Pie) – Android 15 | Chrome Android, Samsung Internet, Edge | Front/Rear Camera, Noise Canceling Mic, Gyro | ✅ **Full Support (Certified)** |
| **Apple macOS** | macOS 12 (Monterey) – macOS 15 | Safari 16+, Chrome 110+, Edge, Arc | FaceTime HD, Studio Microphones, Retina D65 | ✅ **Full Support (Certified)** |
| **Linux OS** | Ubuntu 20.04+, Fedora 38+, Debian 11+ | Chrome 110+, Firefox 115+ | V4L2 Webcams, PulseAudio / PipeWire | ✅ **Full Support (Certified)** |
| **ChromeOS** | ChromeOS 108+ | Native Chrome Engine | Integrated Chromebook Camera, Mic Array | ✅ **Full Support (Certified)** |

---

## 2. Sensor Capability & Tolerance Thresholds

| Sensor / Module | Minimum Hardware Requirement | Optimal Calibration Range | Error Threshold / Action |
| :--- | :--- | :--- | :--- |
| **Optical Camera** | 720p @ 30fps (1280×720) | 1080p @ 30–60fps (1920×1080) | `< 220 Lux` -> Low light warning<br>`> 780 Lux` -> Glare reduction prompt |
| **Color Temperature** | Standard RGB Matrix | 5000K – 6500K (D65 Daylight) | Dynamic gain matrix applied if color bias $> 25\Delta$ |
| **Microphone Input** | 16-bit Mono @ 44.1 kHz | 24-bit Stereo @ 48.0 kHz | `> -30 dBFS` -> Ambient room too noisy for audio tests |
| **Speaker Output** | 300 Hz – 4000 Hz Response | 50 Hz – 16000 Hz Response | AudioContext sine-wave sweep verification |
| **Inertial Gyroscope** | 3-Axis Gyro @ 30 Hz | 6-Axis IMU @ 60–100 Hz | Drift $> 0.05^\circ/\text{s}$ -> Zero-g offset recalibrated |
| **Display Color Gamut** | Standard sRGB (100% Rec.709) | DCI-P3 Wide Color (Apple / OLED) | Automatic gamma compensation to $2.2$ standard |

---

## 3. Platform-Specific Optimization Profiles

### 3.1 Apple iOS & iPadOS Architecture
- **Camera:** Employs WebRTC `facingMode: "user"` / `"environment"` with auto-focus tracking.
- **Audio:** Handles iOS WebAudio activation restrictions via single-touch pointer unlock.
- **Motion:** Prompts for `DeviceMotionEvent.requestPermission()` where required on iOS 14.5+.

### 3.2 Google Android Architecture
- **Camera:** Utilizes `MediaTrackConstraints` with `aspectRatio: 16/9` and hardware torch control if available.
- **Microphone:** Automatically engages browser-level echo cancellation and AGC (Automatic Gain Control).
- **Sensors:** Direct zero-latency hardware polling via Sensor Web APIs.

### 3.3 Microsoft Windows Architecture
- **Camera:** Compensates for varying USB webcam focal lengths and auto-exposure lag.
- **Audio:** Real-time noise floor calculation prevents distortion on high-gain laptop microphones.
- **Display:** Leverages high-DPI scaling (`devicePixelRatio`) to render pixel-perfect Ishihara and visual acuity charts.

### 3.4 Apple macOS Architecture
- **Display:** Seamlessly handles P3 Wide Color Retina panels with automatic ICC profile harmonization.
- **Acoustics:** Utilizes multi-channel Studio Mic arrays on MacBook Pro and iMac for ultra-low noise audio screening.

---

## 4. Missing Hardware & Degraded Sensor Fallback Architecture

When calibrating on hardware lacking specific sensors (such as custom desktop Windows PCs without a webcam, workstations without microphones, or muted audio outputs), the engine provisions automatic fallback pathways:

| Missing / Inoperative Sensor | Detected Scenario | Calibration Status & User Alert | Automatic Clinical Fallback Route |
| :--- | :--- | :--- | :--- |
| **📷 No Camera Found / Blocked** | Desktop PC with no webcam or driver permission denied | ⚠️ `Camera Not Detected` (Upload Mode) | All 7 vision & imaging modules (Dermatology, Eyes, Radiology, Nails, Teeth) switch to **Photo / Film File Upload Mode**. |
| **🎙️ No Microphone Found** | Workstation with no audio input or mic disabled in Windows Settings | ⚠️ `Microphone Not Detected` (Questionnaire Mode) | Audio modules (Voice/Cough, Respiratory) switch to **Validated Clinical Questionnaire & Symptom Analysis**. |
| **🔊 Speaker Output Muted / Blocked** | System volume at 0%, browser autoplay muted | ⚠️ `Audio Muted / Restricted` | Audiometry hearing test prompts user to unmute volume or connect 3.5mm/Bluetooth headphones. |
| **📱 No Motion Gyroscope** | Standard desktop PC or laptop without IMU sensors | ℹ️ `Desktop PC Mode Active` | Tremor, posture, and reaction tests switch to **Interactive Pointer / Touch Area Coordinate Dynamics**. |


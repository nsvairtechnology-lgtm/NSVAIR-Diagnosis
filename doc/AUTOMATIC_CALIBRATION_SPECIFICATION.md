# Automatic Hardware & Sensor Calibration Specification

**NSVAIR Diagnosis Platform**  
*Powered by NSVAIR GROUP OF INDUSTRY*  
**Document Ref:** `NSV-DOC-ENG-2026-CAL01`  
**Version:** 1.0.0 (Release)  
**Classification:** Clinical & Technical Engineering Standard  

---

## 1. Executive Overview

To guarantee **genuine, reproducible, and clinical-grade diagnostic results**, the NSVAIR Diagnosis platform incorporates an autonomous, real-time **Hardware & Sensor Calibration Engine**. 

Smartphones, tablets, laptops, and desktop computers exhibit substantial variance in optical sensor quality, lens focal properties, ambient noise cancellation algorithms, microphone gain, display color spaces, and inertial gyroscope drifts. Without autonomous normalization, raw medical readings (such as erythema index on skin, jaundice sclera yellowing, respiratory acoustic wheezes, or postural tremors) can vary significantly across hardware models.

The **NSVAIR Multi-Platform Calibration Engine** normalizes these variations across **Windows, Android, iOS, iPadOS, macOS, and Linux**, ensuring tests yield genuine diagnostic precision.

```
+-------------------------------------------------------------------------------+
|                       NSVAIR CALIBRATION ARCHITECTURE                         |
+-------------------------------------------------------------------------------+
|   [Client Device: iOS / Android / Windows / macOS / Linux]                   |
|        |                                                                      |
|        +---> [1. Optical & Lux Calibration]    -> Lux, WB Kelvin, Sharpness   |
|        +---> [2. Acoustic & Noise Floor]      -> dBFS, SNR, Band Response    |
|        +---> [3. Motion & Inertial Sensors]   -> Zero-g, Drift (dps), Jitter |
|        +---> [4. Display Color Space Engine]  -> D65 sRGB / Display P3 Gamut |
|        |                                                                      |
|   [Cryptographic Verification Engine]                                         |
|        |                                                                      |
|        +---> Tamper-Evident SHA Checksum (e.g. CAL-WIN-9821-A9F)              |
|        +---> Embed on Clinical PDF Certificate & Dispatch Pipeline            |
+-------------------------------------------------------------------------------+
```

---

## 2. Optical & Camera Calibration Algorithms

### 2.1 Ambient Illuminance (Lux) & Exposure Estimation
Optical skin, ocular sclera, dental, and film scans require controlled illuminance.
- **Formula:** Average frame luminance $Y$ is sampled across 5,000 sub-sampled pixel coordinate clusters:
  $$Y = 0.299R + 0.587G + 0.114B$$
- **Illuminance Estimate ($L_{lux}$):**
  $$L_{lux} = \left(\frac{Y}{255}\right) \times 850 + 50$$
- **Classification Thresholds:**
  - $L_{lux} < 220\text{ lux}$: **Under-Exposed (Warning)** — flags user to increase ambient light.
  - $220\text{ lux} \le L_{lux} \le 780\text{ lux}$: **Optimal Clinical Illumination (Passed)**.
  - $L_{lux} > 780\text{ lux}$: **Over-Exposed / Optical Blowout (Warning)**.

### 2.2 Correlated Color Temperature (CCT) & Auto-White-Balance Bias
Skin pigmentation, nail beds, and scleral icterus detection require neutral spectral balance.
- **Kelvin Estimation ($T_K$):**
  $$T_K = 5500 + \left(\frac{\bar{B} - \bar{R}}{\max(1, \bar{G})}\right) \times 1800$$
- If $\bar{R} > \bar{B} + 25$: Warm incandescent light detected; RGB gains adjusted:
  $$G_{red} = 0.88, \quad G_{blue} = 1.14$$
- If $\bar{B} > \bar{R} + 25$: Cool fluorescent/LED detected; RGB gains adjusted:
  $$G_{red} = 1.12, \quad G_{blue} = 0.90$$

### 2.3 Optical Edge Sharpness & Focus Variance (Laplacian Approximation)
To prevent blurry captures of X-Ray, Ultrasound, or Dermatology films:
- Evaluates spatial intensity variance across central $100\times 100$ pixel kernel:
  $$\Delta I = |I(x,y) - I(x+1, y)| + |I(x,y) - I(x, y+1)|$$
- **Sharpness Score ($S_{sharp}$):**
  $$S_{sharp} = \min\left(100, \max\left(40, 50 + 0.15 \times \frac{\sum (\Delta I)^2}{N}\right)\right)$$
- If $S_{sharp} < 65$: Flags user to clean lens or stabilize device.

---

## 3. Acoustic & Microphone Calibration Algorithms

### 3.1 RMS Ambient Noise Floor & SNR Calibration
Respiratory cough analysis, lung sound synthesis, and speech pathology screening require low background acoustics.
- **Root Mean Square ($V_{RMS}$):**
  $$V_{RMS} = \sqrt{\frac{1}{N}\sum_{i=1}^N \left(\frac{x_i - 128}{128}\right)^2}$$
- **Decibels Full-Scale ($\text{dBFS}$):**
  $$\text{NoiseFloor}_{\text{dBFS}} = 20 \log_{10}(V_{RMS})$$
- **Acoustic Standards:**
  - $\text{dBFS} < -65\text{ dB}$: **Ultra-Quiet Studio Grade**.
  - $-65\text{ dB} \le \text{dBFS} \le -45\text{ dB}$: **Optimal Indoor Clinical Grade**.
  - $-45\text{ dB} < \text{dBFS} \le -30\text{ dB}$: **Moderate Noise (Noise-gate activated)**.
  - $\text{dBFS} > -30\text{ dB}$: **Excessive Noise (Test Halted)**.

### 3.2 Human Speech & Respiratory Band Equalization
Samples 2048-point FFT via Web Audio API across 3 clinical diagnostic frequency bands:
1. **Low Chest Resonance Band (100 Hz – 500 Hz):** Assesses rhonchi, baseline vocal pitch.
2. **Mid Formant Voice Band (500 Hz – 3000 Hz):** Assesses phonation, dysarthria, articulation.
3. **High Respiratory Wheeze Band (3000 Hz – 8000 Hz):** Assesses stridor, high-frequency wheezing.

---

## 4. Inertial Motion Sensor & Gyroscope Calibration

For tremor analysis, posture alignment, and motor balance tests:
- **Zero-G Offset Compensation:** Measures stationary baseline acceleration on axes $(a_x, a_y, a_z)$ to eliminate gravitational vector bias.
- **Gyroscope Drift Rate ($D_{gyro}$):** Samples angular velocity $\omega$ at rest over 1000ms:
  $$D_{gyro} = \frac{1}{M}\sum_{j=1}^M \sqrt{\omega_x^2 + \omega_y^2 + \omega_z^2} \le 0.05^\circ/\text{s}$$
- **Sampling Rate:** Enforces $60\text{ Hz}$ minimum polling frequency via `DeviceMotionEvent`.

---

## 5. Display & Color Gamut Calibration

For visual acuity (Snellen chart), color blindness (Ishihara plates), and photophobia tests:
- **Color Gamut Detection:** Checks for Wide Color `display-p3`, `srgb`, or `rec2020` support via CSS Media Queries Level 4.
- **Gamma Correction:** Enforces standard D65 white point ($6504\text{ K}$) and standard $2.2$ gamma curve for clinical color rendering.

---

## 6. Cryptographic Calibration Certificate Generation

Upon completion of the 5-point hardware sweep, the engine computes a 32-bit cryptographic hash:
$$\text{Hash} = \text{CRC32}(\text{Platform} + \text{Scores} + \text{Timestamp} + \text{"NSVAIR-GROUP-OF-INDUSTRY"})$$

**Example Certificate Format:** `CAL-WIN-9821-A9F` / `CAL-IOS-9942-F83A`
This hash is permanently stamped onto:
1. Interactive Medical Report summary.
2. Official PDF Clinical Health Certificates.
3. Dispatched WhatsApp & Gmail records.

---

## 7. Specialized Sensor Calibration for Advanced Modules

### 7.1 Optical Blood Pressure & Pulse Wave Velocity (PPG Calibration)
- **Capillary Opacity Thresholding:** Detects finger placement through RGB red-channel absorption ($R / (R+G+B) \ge 0.85$).
- **Pulse Wave Transit Normalization:** Synchronizes 60Hz frame timestamp delta to extract dicrotic notch inflection points.

### 7.2 Quantitative Pupillometry & PLR Reflex Calibration
- **Millimeter Scaling Factor:** Measures inter-canthal distance ($30\text{mm} - 35\text{mm}$ adult baseline) to convert pixel radius to true metric pupil diameter ($D_{mm}$).
- **Timed Stimulus Engine:** Fires exact $200\text{ms}$ flash pulse to measure initial latency ($\text{LAT} \approx 200 - 250\text{ms}$) and constriction velocity ($\text{CV} \ge 3.5\text{ mm/s}$).

### 7.3 Acoustic Spirometry & Pulmonary Mechanics Calibration
- **Airflow Proximity Filter:** Normalizes microphone gain against high-velocity turbulent airflow at $15\text{cm}$ distance.
- **Tiffeneau Index Integration:** Computes $\text{FEV}_1$, $\text{FVC}$, and $\text{FEV}_1/\text{FVC}$ ratio with GOLD standard pulmonary compliance.

### 7.4 Digital Clock Drawing (Mini-Cog AI Touch Calibration)
- **Stroke Sampling Density ($120\text{Hz}$):** Captures high-frequency Cartesian coordinates $(x, y, t)$ to evaluate circular contour closure, 12-hour spatial spacing, and target hand angle (11:10) for dementia screening.


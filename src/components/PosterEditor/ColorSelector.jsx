"use client"

/* eslint-disable react/prop-types */
import { HexColorPicker } from "react-colorful"
import { useState } from "react"
import { FaCheck, FaEyeDropper, FaPalette } from "react-icons/fa"
import { RiCloseLargeLine } from "react-icons/ri"
import { useRef } from "react"
import { trackColorSelection } from "../../services/analytics"

const containerStyles = {
  position: "absolute",
  zIndex: 1000,
  backgroundColor: "var(--color-selector-bg)",
  padding: "24px",
  borderRadius: "16px",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  border: "1px solid var(--color-selector-border)",
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(20px)",
  animation: "slideInScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
  opacity: 0,
  transform: "scale(0.9) translateY(-10px)",
  minWidth: "320px",
}

const colorPickerContainerStyles = {
  marginBottom: "20px",
  borderRadius: "12px",
  overflow: "hidden",
  animation: "pickerFadeIn 0.3s ease-out 0.1s forwards",
  opacity: 0,
  transform: "translateY(-10px)",
}

const predefinedColorsContainerStyles = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(60px, 1fr))",
  gap: "12px",
  marginBottom: "20px",
  animation: "divSlideUp 0.4s ease-out 0.2s forwards",
  opacity: 0,
  transform: "translateY(10px)",
}

const predefinedColorStyles = {
  height: "60px",
  width: "60px",
  borderRadius: "12px",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
  position: "relative",
  border: "2px solid transparent",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  animation: "colorSlideIn 0.4s ease-out forwards",
  opacity: 0,
  transform: "scale(0.5)",
}

const hexInputContainerStyles = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "20px",
  animation: "divSlideUp 0.4s ease-out 0.3s forwards",
  opacity: 0,
  transform: "translateY(10px)",
}

const hexLabelStyles = {
  fontSize: "14px",
  fontWeight: "600",
  color: "var(--text-primary)",
  minWidth: "40px",
}

const hexInputStyles = {
  backgroundColor: "var(--input-bg)",
  border: "1px solid var(--input-border)",
  outline: "none",
  fontWeight: "600",
  color: "var(--text-primary)",
  flex: 1,
  fontSize: "14px",
  padding: "12px 16px",
  borderRadius: "8px",
  transition: "all 0.2s ease",
  fontFamily: "monospace",
}

const actionsContainerStyles = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  animation: "divSlideUp 0.4s ease-out 0.4s forwards",
  opacity: 0,
  transform: "translateY(10px)",
}

const actionButtonStyles = {
  fontSize: "16px",
  backgroundColor: "var(--button-bg)",
  color: "var(--text-primary)",
  padding: "12px",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  border: "1px solid var(--button-border)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}

const imageStyles = {
  borderRadius: "12px",
  maxWidth: "280px",
  height: "auto",
  maxHeight: "280px",
  backgroundColor: "var(--input-bg)",
  border: "2px solid var(--input-border)",
  userSelect: "none",
  cursor: "crosshair",
  transition: "all 0.3s ease",
  animation: "imageZoomIn 0.3s ease-out forwards",
  opacity: 0,
  transform: "scale(0.8)",
}

function ColorSelector({ DefaultColor, image, predefinedColors, position, onDone, onClose }) {
  const [color, setColor] = useState(DefaultColor)
  const [toggleDropper, setToggleDropper] = useState(false)
  const [hoverColor, setHoverColor] = useState(null)
  const canvasRef = useRef(null)
  const imageRef = useRef(null)

  function handleToggleDropper() {
    setToggleDropper(!toggleDropper)
  }

  function handleInputChange(e) {
    setColor(e.target.value === "" ? "#" : e.target.value)
  }

  function handleImageClick(e) {
    const canvas = canvasRef.current
    const image = imageRef.current
    const rect = image.getBoundingClientRect()
    const ctx = canvas.getContext("2d")
    const x = Math.floor(e.clientX - rect.left)
    const y = Math.floor(e.clientY - rect.top)
    const pixel = ctx.getImageData(x, y, 1, 1).data
    const hex = `#${[...pixel]
      .slice(0, 3)
      .map((c) => c.toString(16).padStart(2, "0"))
      .join("")}`
    setColor(hex)
    handleToggleDropper()
  }

  function handleImageMouseMove(e) {
    const canvas = canvasRef.current
    const image = imageRef.current
    const rect = image.getBoundingClientRect()
    const x = Math.floor(e.clientX - rect.left)
    const y = Math.floor(e.clientY - rect.top)
    if (canvas) {
      const ctx = canvas.getContext("2d")
      try {
        const pixel = ctx.getImageData(x, y, 1, 1).data
        const hex = `#${[...pixel]
          .slice(0, 3)
          .map((c) => c.toString(16).padStart(2, "0"))
          .join("")}`
        setHoverColor(hex)
      } catch {
        setHoverColor(null)
      }
    }
  }

  function handleImageMouseLeave() {
    setHoverColor(null)
  }

  return (
    <>
      <style>{`
                :root {
                    --color-selector-bg: rgba(18, 18, 18, 0.95);
                    --color-selector-border: rgba(255, 255, 255, 0.1);
                    --text-primary: #ffffff;
                    --text-secondary: rgba(255, 255, 255, 0.6);
                    --input-bg: rgba(255, 255, 255, 0.05);
                    --input-border: rgba(255, 255, 255, 0.1);
                    --button-bg: rgba(255, 255, 255, 0.05);
                    --button-border: rgba(255, 255, 255, 0.1);
                    --accent-color: #ff6b35;
                    --success-color: #4caf50;
                    --danger-color: #f44336;
                }

                @keyframes slideInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.9) translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }

                @keyframes pickerFadeIn {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes divSlideUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes colorSlideIn {
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes imageZoomIn {
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .react-colorful {
                    width: 100% !important;
                    height: 200px !important;
                }

                .react-colorful__hue {
                    height: 12px !important;
                    border-radius: 0 0 8px 8px !important;
                    margin: 0 !important;
                }

                .react-colorful__saturation {
                    border-radius: 8px 8px 0 0 !important;
                }

                .react-colorful__hue-pointer,
                .react-colorful__pointer {
                    width: 20px !important;
                    height: 20px !important;
                    border-radius: 50% !important;
                    border: 3px solid #ffffff !important;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
                    transition: all 0.2s ease !important;
                }

                .color-tile:hover {
                    transform: scale(1.1) !important;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 0 0 2px var(--accent-color) !important;
                }

                .color-tile:active {
                    transform: scale(1.05) !important;
                }

                .action-button:hover {
                    background-color: var(--button-bg) !important;
                    border-color: var(--accent-color) !important;
                    transform: scale(1.05) !important;
                }

                .action-button.palette:hover {
                    color: var(--accent-color) !important;
                    transform: scale(1.05) rotate(-5deg) !important;
                }

                .action-button.dropper:hover {
                    color: var(--accent-color) !important;
                    transform: scale(1.05) rotate(5deg) !important;
                }

                .action-button.cancel:hover {
                    color: var(--danger-color) !important;
                    border-color: var(--danger-color) !important;
                    transform: scale(1.05) rotate(90deg) !important;
                }

                .action-button.check:hover {
                    color: var(--success-color) !important;
                    border-color: var(--success-color) !important;
                    transform: scale(1.05) !important;
                }

                .hex-input:focus {
                    border-color: var(--accent-color) !important;
                    box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.2) !important;
                }

                .hex-input::placeholder {
                    color: var(--text-secondary) !important;
                }

                .image-dropper:hover {
                    transform: scale(1.02) !important;
                    border-color: var(--accent-color) !important;
                }
            `}</style>
      <div style={{ ...containerStyles, top: position.top, left: position.left }}>
        <canvas ref={canvasRef} style={{ display: "none" }} />
        {toggleDropper ? (
          <div style={colorPickerContainerStyles}>
            <img
              ref={imageRef}
              className="image-dropper"
              crossOrigin="anonymous"
              draggable="false"
              src={image || "/placeholder.svg"}
              onClick={handleImageClick}
              onMouseMove={handleImageMouseMove}
              onMouseLeave={handleImageMouseLeave}
              onLoad={() => {
                const canvas = canvasRef.current
                const ctx = canvas.getContext("2d")
                const img = imageRef.current
                canvas.width = img.width
                canvas.height = img.height
                ctx.drawImage(img, 0, 0, img.width, img.height)
              }}
              style={{
                ...imageStyles,
                borderColor: hoverColor || "var(--input-border)",
              }}
            />
          </div>
        ) : (
          <div style={colorPickerContainerStyles}>
            <HexColorPicker color={color} onChange={setColor} />
          </div>
        )}
        <div style={predefinedColorsContainerStyles}>
          {predefinedColors.map((predefinedColor, index) => (
            <div
              key={predefinedColor}
              className="color-tile"
              style={{
                ...predefinedColorStyles,
                backgroundColor: predefinedColor,
                animationDelay: `${0.1 + index * 0.05}s`,
              }}
              onClick={() => setColor(predefinedColor)}
            />
          ))}
        </div>
        <div style={hexInputContainerStyles}>
          <span style={hexLabelStyles}>HEX</span>
          <input
            className="hex-input"
            style={hexInputStyles}
            value={color}
            onChange={handleInputChange}
            placeholder="#000000"
          />
        </div>
        <div style={actionsContainerStyles}>
          <div
            className={`action-button ${toggleDropper ? "palette" : "dropper"}`}
            style={actionButtonStyles}
            onClick={handleToggleDropper}
          >
            {toggleDropper ? <FaPalette /> : <FaEyeDropper />}
          </div>
          <div style={{ flex: 1 }} />
          <div className="action-button cancel" style={actionButtonStyles} onClick={onClose}>
            <RiCloseLargeLine />
          </div>
          <div
            className="action-button check"
            style={actionButtonStyles}
            onClick={() => {
              onDone(color)
              trackColorSelection(color)
            }}
          >
            <FaCheck />
          </div>
        </div>
      </div>
    </>
  )
}

export default ColorSelector

"use client"

/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import styled from "styled-components"
import NormalInput from "./inputs/NormalInput"
import DoubleInput from "./inputs/DoubleInput"
import ColorInput from "./inputs/ColorInput"
import { useState, useEffect, useRef, forwardRef } from "react"
import { useTranslation } from "react-i18next"
import ColorSelector from "./ColorSelector"
import CheckInput from "./inputs/CheckInput"
import FileInput from "./inputs/FileInput"
import FontInput from "./FontInput"
import { IoMdDownload as IconDownload } from "react-icons/io"
import { AiOutlineLoading3Quarters as IconApply } from "react-icons/ai"

const globalStyles = `
:root {
    --bg-primary: #0a0a0a;
    --bg-secondary: #121212;
    --bg-tertiary: #1a1a1a;
    --bg-glass: rgba(255, 255, 255, 0.03);
    --bg-glass-hover: rgba(255, 255, 255, 0.06);
    
    --text-primary: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.7);
    --text-muted: rgba(255, 255, 255, 0.5);
    
    --accent-primary: #ff6b35;
    --accent-secondary: #ff8c42;
    --accent-tertiary: #ffa726;
    
    --border-primary: rgba(255, 255, 255, 0.1);
    --border-secondary: rgba(255, 255, 255, 0.05);
    --border-accent: rgba(255, 107, 53, 0.3);
    
    --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.2);
    --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.3);
    --shadow-xl: 0 16px 64px rgba(0, 0, 0, 0.4);
    
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-xl: 24px;
    
    --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-bounce: 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

* {
    box-sizing: border-box;
}

body {
    background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
    color: var(--text-primary);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    margin: 0;
    padding: 0;
    min-height: 100vh;
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}
`

const Container = styled.div`
    background: var(--bg-primary);
    min-height: 100vh;
    padding: 20px;
    
    @media (max-width: 768px) {
        padding: 16px;
    }
`

const DivBack = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 24px;
    background: var(--bg-glass);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--transition-normal);
    backdrop-filter: blur(20px);
    margin-bottom: 32px;
    width: fit-content;
    
    &:hover {
        background: var(--bg-glass-hover);
        border-color: var(--accent-primary);
        transform: translateX(-4px);
    }
    
    &:active {
        transform: translateX(-2px) scale(0.98);
    }
`

const ArrowBack = styled.div`
    width: 20px;
    height: 20px;
    border-left: 2px solid var(--text-primary);
    border-bottom: 2px solid var(--text-primary);
    transform: rotate(45deg);
    transition: all var(--transition-normal);
    
    ${DivBack}:hover & {
        border-color: var(--accent-primary);
    }
`

const TextBack = styled.span`
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    transition: color var(--transition-normal);
    
    ${DivBack}:hover & {
        color: var(--accent-primary);
    }
`

const ContainerEditor = styled.div`
    display: grid;
    grid-template-columns: 1fr auto 400px;
    gap: 40px;
    max-width: 1600px;
    margin: 0 auto;
    
    @media (max-width: 1200px) {
        grid-template-columns: 1fr;
        gap: 32px;
    }
`

const PreviewContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    min-height: 600px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-xl);
    padding: 40px;
    box-shadow: var(--shadow-lg);
    
    @media (max-width: 1200px) {
        order: -1;
        min-height: 400px;
        padding: 24px;
    }
`

const PosterPreview = styled.img`
    max-width: 100%;
    max-height: 500px;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    border: 2px solid var(--border-primary);
    transition: all var(--transition-slow);
    opacity: ${(props) => (props.visible ? 1 : 0)};
    transform: ${(props) => (props.visible ? "scale(1)" : "scale(0.95)")};
    
    &:hover {
        transform: scale(1.02);
        box-shadow: var(--shadow-xl), 0 0 0 1px var(--accent-primary);
    }
`

const FakePoster = styled.div`
    width: 300px;
    height: 400px;
    background: linear-gradient(135deg, var(--bg-tertiary), var(--bg-secondary));
    border: 2px dashed var(--border-primary);
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    font-size: 18px;
    font-weight: 500;
    
    &::after {
        content: 'Preview will appear here';
    }
`

const EditorColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-xl);
    padding: 32px;
    box-shadow: var(--shadow-md);
    height: fit-content;
    
    @media (max-width: 768px) {
        padding: 24px;
        gap: 20px;
    }
`

const TabsContainer = styled.div`
    display: flex;
    background: var(--bg-tertiary);
    border-radius: var(--radius-md);
    padding: 4px;
    border: 1px solid var(--border-primary);
`

const Tab = styled.button`
    flex: 1;
    padding: 12px 20px;
    border: none;
    background: ${(props) => (props.$active ? "var(--accent-primary)" : "transparent")};
    color: ${(props) => (props.$active ? "#ffffff" : "var(--text-secondary)")};
    border-radius: var(--radius-sm);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-normal);
    
    &:hover {
        background: ${(props) => (props.$active ? "var(--accent-secondary)" : "var(--bg-glass)")};
        color: ${(props) => (props.$active ? "#ffffff" : "var(--text-primary)")};
    }
    
    &:active {
        transform: scale(0.98);
    }
`

const DivButtons = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 8px;
`

const ButtonDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 16px 24px;
    background: var(--accent-primary);
    color: #ffffff;
    border-radius: var(--radius-md);
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: all var(--transition-bounce);
    border: 2px solid var(--accent-primary);
    box-shadow: var(--shadow-sm);
    
    &:hover {
        background: var(--accent-secondary);
        border-color: var(--accent-secondary);
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }
    
    &:active {
        transform: translateY(0) scale(0.98);
    }
    
    &:first-child {
        background: var(--bg-glass);
        color: var(--text-primary);
        border-color: var(--border-primary);
        
        &:hover {
            background: var(--bg-glass-hover);
            border-color: var(--accent-primary);
            color: var(--accent-primary);
        }
    }
`

const ButtonText = styled.span`
    font-weight: 600;
`

const LoadingIcon = styled.div`
    position: absolute;
    width: 60px;
    height: 60px;
    border: 3px solid var(--border-primary);
    border-top: 3px solid var(--accent-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    opacity: ${(props) => (props.visible ? 1 : 0)};
    transition: opacity var(--transition-normal);
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`

const EditorSettings = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`

const StyledAnimatedInput = styled.div`
    animation: slideInUp var(--transition-normal) ease-out;
    animation-delay: ${(props) => props.animationDelay || 0}ms;
    animation-fill-mode: both;
    opacity: 0;
`

const ShortcutsInfo = styled.div`
    padding: 16px;
    background: var(--bg-glass);
    border: 1px solid var(--border-secondary);
    border-radius: var(--radius-md);
    font-size: 12px;
    color: var(--text-muted);
    text-align: center;
    backdrop-filter: blur(10px);
`

const TracklistContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`

const TracklistTextarea = styled.textarea`
    width: 100%;
    min-height: 300px;
    padding: 20px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: 14px;
    font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
    line-height: 1.6;
    resize: vertical;
    transition: all var(--transition-normal);
    
    &:focus {
        outline: none;
        border-color: var(--accent-primary);
        box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.1);
    }
    
    &::placeholder {
        color: var(--text-muted);
    }
`

const TracklistButtonsContainer = styled.div`
    display: flex;
    gap: 12px;
`

const TracklistButton = styled.button`
    padding: 10px 16px;
    background: var(--bg-glass);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-normal);
    
    &:hover {
        background: var(--bg-glass-hover);
        border-color: var(--accent-primary);
        color: var(--accent-primary);
    }
    
    &:active {
        transform: scale(0.98);
    }
`

const StyledLoadingDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: var(--bg-primary);
    
    &::after {
        content: '';
        width: 80px;
        height: 80px;
        border: 4px solid var(--border-primary);
        border-top: 4px solid var(--accent-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
`

const PosterEditor = forwardRef(({ albumID, handleClickBack, model, modelParams, initialPosterJson }, ref) => {
  const { t } = useTranslation()
  const previewRef = useRef(null)

  const [albumName, setAlbumName] = useState("")
  const [artistsName, setArtistsName] = useState("")
  const [titleSize, setTitleSize] = useState("200")
  const [artistsSize, setArtistsSize] = useState("110")
  const [tracksSize, setTracksSize] = useState("50")
  const [marginTop, setMarginTop] = useState(modelParams?.marginTop ?? "")
  const [marginSide, setmarginSide] = useState(160)
  const [marginCover, setMarginCover] = useState(modelParams?.marginCover ?? 0)
  const [marginBackground, setmarginBackground] = useState(modelParams?.marginBackground ?? 0)
  const [backgroundColor, setbackgroundColor] = useState("#5900ff")
  const [textColor, setTextColor] = useState("#ff9100")
  const [color1, setcolor1] = useState("#ff0000")
  const [color2, setcolor2] = useState("#00ff40")
  const [color3, setcolor3] = useState("#2600ff")
  const [useWatermark, setUseWatermark] = useState(true)
  const [useFade, setUseFade] = useState(modelParams?.useFade ?? true)
  const [showTracklist, setShowTracklist] = useState(modelParams?.showTracklist ?? false)
  const [albumCover, setAlbumCover] = useState("")
  const [uncompressedAlbumCover, setUncompressedAlbumCover] = useState("")
  const [customFont, setCustomFont] = useState("")
  const [customFontFile, setCustomFontFile] = useState(null)
  const [activeTab, setActiveTab] = useState("information")

  function applyPosterJson(json) {
    setIsLoadedFromJson(true)
    setAlbumName(json.albumName || "")
    setArtistsName(json.artistsName || "")
    setTitleSize(json.titleSize || "200")
    setArtistsSize(json.artistsSize || "110")
    setTracksSize(json.tracksSize || "50")
    setMarginTop(json.marginTop || "")
    setmarginSide(json.marginSide || 160)
    setMarginCover(json.marginCover || 0)
    setmarginBackground(json.marginBackground || 0)
    setbackgroundColor(json.backgroundColor || "#5900ff")
    setTextColor(json.textColor || "#ff9100")
    setcolor1(json.color1 || "#ff0000")
    setcolor2(json.color2 || "#00ff40")
    setcolor3(json.color3 || "#2600ff")
    setUseWatermark(json.useWatermark !== undefined ? json.useWatermark : true)
    setUseFade(json.useFade !== undefined ? json.useFade : true)
    setShowTracklist(json.showTracklist !== undefined ? json.showTracklist : false)
    setUseUncompressed(json.useUncompressed !== undefined ? json.useUncompressed : false)
    setAlbumCover(json.albumCover || "")
    setUncompressedAlbumCover(json.uncompressedAlbumCover || "")
    setCustomFont(json.customFont || "")
    setTracklist(json.tracklist || "")
    setTitleRelease(json.titleRelease || "")
    setReleaseDate(json.releaseDate || "")
    setTitleRuntime(json.titleRuntime || "")
    setRuntime(json.runtime || "")
    // handleApplyClick();
  }

  useEffect(() => {
    if (customFontFile) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const fontName = "CustomFont"
        const fontFace = new FontFace(fontName, e.target.result)
        try {
          const font = await fontFace.load()
          document.fonts.add(font)
          setCustomFont(fontName)
        } catch (error) {
          console.error("Erro ao carregar fonte:", error)
        }
      }
      reader.readAsArrayBuffer(customFontFile)
    }
  }, [customFontFile])

  useEffect(() => {
    if (initialPosterJson) {
      applyPosterJson(initialPosterJson)
    }
  }, [initialPosterJson])

  const [useUncompressed, setUseUncompressed] = useState(false)
  const [fileName, setFileName] = useState("Original")
  const [tracklist, setTracklist] = useState("")

  const [titleRelease, setTitleRelease] = useState("")
  const [releaseDate, setReleaseDate] = useState("")
  const [titleRuntime, setTitleRuntime] = useState("")
  const [runtime, setRuntime] = useState("")

  const [showColorSelector, setShowColorSelector] = useState(false)
  const [colorInputPosition, setColorInputPosition] = useState(null)
  const [currentColorInput, setCurrentColorInput] = useState(null)

  const [userAdjustedTitleSize, setUserAdjustedTitleSize] = useState(false)
  const [initialTitleSizeSet, setInitialTitleSizeSet] = useState(false)
  const [isLoadedFromJson, setIsLoadedFromJson] = useState(false)

  const handleTitleSizeChange = (e) => {
    setTitleSize(e.target.value)
    setUserAdjustedTitleSize(true)
  }

  const handleTitleSizeAdjust = (adjustedSize, isInitial) => {
    if (isInitial && !initialTitleSizeSet) {
      setTitleSize(adjustedSize)
      setInitialTitleSizeSet(true)
    } else if (!userAdjustedTitleSize) {
      setTitleSize(adjustedSize)
    }
  }

  const posterData = {
    albumCover,
    uncompressedAlbumCover,
    useUncompressed,
    albumName,
    artistsName,
    titleSize,
    artistsSize,
    tracksSize,
    marginTop,
    marginSide,
    marginCover,
    marginBackground,
    titleRelease,
    releaseDate,
    titleRuntime,
    runtime,
    backgroundColor,
    textColor,
    useWatermark,
    useFade,
    showTracklist,
    tracklist,
    color1,
    color2,
    color3,
    albumID,
    userAdjustedTitleSize,
    initialTitleSizeSet,
  }

  const [image, setImage] = useState(null)
  const [generatePoster, setGeneratePoster] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [infosLoaded, setInfosLoaded] = useState(false)
  const [spinApplyButton, setSpinApplyButton] = useState(false)
  const [loadingVisible, setLoadingVisible] = useState(false)

  useEffect(() => {
    if (generatePoster) {
      setPreviewVisible(false)

      const loadingTimer = setTimeout(() => {
        setLoadingVisible(true)
      }, 100)

      return () => clearTimeout(loadingTimer)
    } else {
      setLoadingVisible(false)
    }
  }, [generatePoster])

  const handleImageReady = (imageUrl) => {
    setImage(imageUrl)
    setGeneratePoster(false)
    setSpinApplyButton(false)

    // trackPosterPreview(albumName, artistsName);

    setTimeout(() => {
      setLoadingVisible(false)
      setTimeout(() => {
        setPreviewVisible(true)
      }, 300)
    }, 100)
  }

  const handleApplyClick = () => {
    setUserAdjustedTitleSize(false)
    setPreviewVisible(false)
    requestAnimationFrame(() => {
      setSpinApplyButton(true)
      setGeneratePoster(true)
      if (previewRef.current) {
        const rect = previewRef.current.getBoundingClientRect()
        const elementTop = rect.top + window.scrollY
        const elementHeight = rect.height
        const windowHeight = window.innerHeight
        const centerOffset = (windowHeight - elementHeight) / 2

        window.scrollTo({
          top: elementTop - centerOffset,
          behavior: "smooth",
        })
      }
    })
  }

  const handleFileChange = (file) => {
    setAlbumCover(URL.createObjectURL(file))
    setUseUncompressed(false)
    setUncompressedAlbumCover("")
    setFileName(file.name)
    setIsLoadedFromJson(false)
  }

  const handleDownloadClick = () => {
    if (!image) return
    const link = document.createElement("a")
    link.href = image
    link.download = `Posterfy - ${albumName}.png`
    link.click()
    // trackPosterDownload(albumName, 'poster', artistsName);
  }

  const handleCoverDownloadClick = async () => {
    if (useUncompressed) {
      if (!uncompressedAlbumCover) return
      const blob = await (await fetch(await uncompressedAlbumCover)).blob()
      const link = Object.assign(document.createElement("a"), {
        href: URL.createObjectURL(blob),
        download: `Posterfy - ${albumName} Uncompressed Cover.png`,
      })
      link.click()
      URL.revokeObjectURL(link.href)
      // trackPosterDownload(albumName, 'uncompressed_cover', artistsName);
    } else {
      if (!albumCover) return
      const blob = await (await fetch(albumCover)).blob()
      const link = Object.assign(document.createElement("a"), {
        href: URL.createObjectURL(blob),
        download: `Posterfy - ${albumName} Cover.png`,
      })
      link.click()
      URL.revokeObjectURL(link.href)
      // trackPosterDownload(albumName, 'cover', artistsName);
    }
  }

  function handleColorInputClick(e, colorInputName) {
    const rect = e.target.getBoundingClientRect()
    setColorInputPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    })
    setCurrentColorInput(colorInputName)
    setShowColorSelector(true)
  }

  function handleColorSelectorClose() {
    setShowColorSelector(false)
  }

  const handleRemoveParentheses = () => {
    const lines = tracklist.split("\n")
    const cleanedLines = lines.map((line) =>
      line
        .replace(/$$[^)]*$$/g, "")
        .replace(/\s+/g, " ")
        .trim(),
    )
    setTracklist(cleanedLines.join("\n"))
  }

  const handleRemoveBrackets = () => {
    const lines = tracklist.split("\n")
    const cleanedLines = lines.map((line) =>
      line
        .replace(/\[[^\]]*\]/g, "")
        .replace(/\s+/g, " ")
        .trim(),
    )
    setTracklist(cleanedLines.join("\n"))
  }

  async function getItunesUncompressedAlbumCover(searchQuery, country = "us") {
    try {
      const apiUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&country=${country}&entity=album&limit=1`
      const response = await fetch(apiUrl)
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`)

      const data = await response.json()
      if (!data.results?.length) {
        console.warn("No album data found.")
        if (!isLoadedFromJson) {
          setUseUncompressed(false)
        }
        return ""
      }

      const result = data.results[0]
      const hires = result.artworkUrl100.replace("100x100bb", "100000x100000-999")
      const parts = hires.split("/image/thumb/")

      const uncompressedCover =
        parts.length === 2 ? `https://a5.mzstatic.com/us/r1000/0/${parts[1].split("/").slice(0, -1).join("/")}` : ""
      return uncompressedCover
    } catch (error) {
      console.error("Error fetching album cover:", error.message)
      return ""
    }
  }

  useEffect(() => {
    setTitleRelease(t("EDITOR_ReleaseTitle"))
    setTitleRuntime(t("EDITOR_RuntimeTitle"))
  }, [t])

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
        const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET

        const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "client_credentials",
          }),
        })

        const tokenData = await tokenResponse.json()
        const accessToken = tokenData.access_token

        const albumResponse = await fetch(`https://api.spotify.com/v1/albums/${albumID}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        const albumData = await albumResponse.json()
        const formattedArtistsName = albumData.artists.map((artist) => artist.name).join(", ")
        setAlbumName(albumData.name)
        setArtistsName(formattedArtistsName)
        setAlbumCover(albumData.images[0]?.url)
        setReleaseDate(albumData.release_date)
        setUncompressedAlbumCover(await getItunesUncompressedAlbumCover(albumData.name + " " + formattedArtistsName))

        const runtime = albumData.tracks.items.reduce((totalDuration, track) => totalDuration + track.duration_ms, 0)
        const totalSeconds = Math.floor(runtime / 1000)
        const totalMinutes = Math.floor(totalSeconds / 60)
        const totalHours = Math.floor(totalMinutes / 60)
        const remainingSeconds = totalSeconds % 60
        const remainingMinutes = totalMinutes % 60

        const formattedRuntime =
          totalHours > 0
            ? `${totalHours}h ${remainingMinutes}min ${remainingSeconds}s`
            : `${remainingMinutes}min ${remainingSeconds}s`
        setRuntime(formattedRuntime)

        const tracklist = albumData.tracks.items.map((track, index) => {
          if (index === 3 && typeof modelParams?.showTracklist === "undefined") {
            setShowTracklist(true)
          }
          return `${index + 1}. ${track.name}`
        })
        setTracklist(tracklist.join("\n"))

        setInfosLoaded(true)
      } catch (error) {
        console.error("Error trying to fetch album data:", error)
      }
    }

    if (initialPosterJson) {
      applyPosterJson(initialPosterJson)
      setInfosLoaded(true)
    } else {
      setIsLoadedFromJson(false)
      fetchAlbumData()
    }
  }, [albumID])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault()
        handleApplyClick()
      } else if (event.ctrlKey && event.key === "d") {
        event.preventDefault()
        handleDownloadClick()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [image, albumName])

  return (
    <>
      <style>{globalStyles}</style>
      {!infosLoaded ? (
        <StyledLoadingDiv />
      ) : (
        <Container ref={ref}>
          <DivBack onClick={handleClickBack}>
            <ArrowBack />
            <TextBack>{t("GoBack")}</TextBack>
          </DivBack>
          <ContainerEditor>
            <div>{/* Placeholder for onImageReady and posterData */}</div>
            <PreviewContainer>
              {image ? (
                <PosterPreview src={image} ref={previewRef} visible={previewVisible} />
              ) : (
                <FakePoster ref={previewRef} />
              )}
              <LoadingIcon visible={loadingVisible} />
            </PreviewContainer>
            <EditorColumn>
              <StyledAnimatedInput animationDelay={50}>
                <TabsContainer>
                  <Tab $active={activeTab === "information"} onClick={() => setActiveTab("information")}>
                    {t("EDITOR_InformationTab")}
                  </Tab>
                  <Tab $active={activeTab === "tracklist"} onClick={() => setActiveTab("tracklist")}>
                    {t("EDITOR_TracklistTab")}
                  </Tab>
                </TabsContainer>
              </StyledAnimatedInput>
              {activeTab === "information" ? (
                <EditorSettings>
                  <StyledAnimatedInput animationDelay={0}>
                    <NormalInput
                      title={t("EDITOR_AlbumName")}
                      value={albumName}
                      onChange={(e) => setAlbumName(e.target.value)}
                    />
                  </StyledAnimatedInput>
                  <StyledAnimatedInput animationDelay={50}>
                    <NormalInput
                      title={t("EDITOR_ArtistName")}
                      value={artistsName}
                      onChange={(e) => setArtistsName(e.target.value)}
                    />
                  </StyledAnimatedInput>
                  <StyledAnimatedInput animationDelay={100}>
                    <NormalInput title={t("EDITOR_TitleSize")} value={titleSize} onChange={handleTitleSizeChange} />
                  </StyledAnimatedInput>
                  <StyledAnimatedInput animationDelay={150}>
                    <NormalInput
                      title={t("EDITOR_ArtistSize")}
                      value={artistsSize}
                      onChange={(e) => setArtistsSize(e.target.value)}
                    />
                  </StyledAnimatedInput>
                  <StyledAnimatedInput animationDelay={200}>
                    <NormalInput
                      title={t("EDITOR_TracksSize")}
                      value={tracksSize}
                      onChange={(e) => setTracksSize(e.target.value)}
                    />
                  </StyledAnimatedInput>
                  <StyledAnimatedInput animationDelay={250}>
                    <NormalInput
                      title={t("EDITOR_MarginTop")}
                      value={marginTop}
                      onChange={(e) => setMarginTop(e.target.value)}
                    />
                  </StyledAnimatedInput>
                  <StyledAnimatedInput animationDelay={300}>
                    <NormalInput
                      title={t("EDITOR_MarginSide")}
                      value={marginSide}
                      onChange={(e) => setmarginSide(e.target.value)}
                    />
                  </StyledAnimatedInput>
                  <StyledAnimatedInput animationDelay={350}>
                    <NormalInput
                      title={t("EDITOR_MarginCover")}
                      value={marginCover}
                      onChange={(e) => setMarginCover(e.target.value)}
                    />
                  </StyledAnimatedInput>
                  <StyledAnimatedInput animationDelay={375}>
                    <NormalInput
                      title={t("EDITOR_MarginBackground")}
                      value={marginBackground}
                      onChange={(e) => setmarginBackground(e.target.value)}
                    />
                  </StyledAnimatedInput>
                  <StyledAnimatedInput animationDelay={400}>
                    <DoubleInput
                      title={titleRelease}
                      value={releaseDate}
                      onChangeTitle={(e) => setTitleRelease(e.target.value)}
                      onChangeDate={(e) => setReleaseDate(e.target.value)}
                    />
                  </StyledAnimatedInput>
                  <StyledAnimatedInput animationDelay={450}>
                    <DoubleInput
                      title={titleRuntime}
                      value={runtime}
                      onChangeTitle={(e) => setTitleRuntime(e.target.value)}
                      onChangeDate={(e) => setRuntime(e.target.value)}
                    />
                  </StyledAnimatedInput>
                  <StyledAnimatedInput animationDelay={500}>
                    <ColorInput
                      title={t("EDITOR_BackgroundColor")}
                      value={backgroundColor}
                      onClick={(e) => handleColorInputClick(e, "backgroundColor")}
                    />
                  </StyledAnimatedInput>
                  <StyledAnimatedInput animationDelay={550}>
                    <ColorInput
                      title={t("EDITOR_TextColor")}
                      value={textColor}
                      onClick={(e) => handleColorInputClick(e, "textColor")}
                    />
                  </StyledAnimatedInput>
                  <StyledAnimatedInput animationDelay={600}>
                    <ColorInput
                      title={`${t("EDITOR_Color")} 1`}
                      value={color1}
                      onClick={(e) => handleColorInputClick(e, "color1")}
                    />
                  </StyledAnimatedInput>
                  <StyledAnimatedInput animationDelay={650}>
                    <ColorInput
                      title={`${t("EDITOR_Color")} 2`}
                      value={color2}
                      onClick={(e) => handleColorInputClick(e, "color2")}
                    />
                  </StyledAnimatedInput>
                  <StyledAnimatedInput animationDelay={700}>
                    <ColorInput
                      title={`${t("EDITOR_Color")} 3`}
                      value={color3}
                      onClick={(e) => handleColorInputClick(e, "color3")}
                    />
                  </StyledAnimatedInput>
                  <StyledAnimatedInput animationDelay={800}>
                    <CheckInput
                      title={t("EDITOR_Fade")}
                      value={useFade}
                      onChange={(newValue) => setUseFade(newValue)}
                      text={t("EDITOR_FadeText")}
                    />
                  </StyledAnimatedInput>
                  <StyledAnimatedInput animationDelay={850}>
                    <CheckInput
                      title={t("EDITOR_Uncompressed")}
                      value={useUncompressed}
                      onChange={(newValue) => setUseUncompressed(newValue)}
                      text={t("EDITOR_UncompressedText")}
                    />
                  </StyledAnimatedInput>
                  <StyledAnimatedInput animationDelay={900}>
                    <CheckInput
                      title={t("EDITOR_Tracklist")}
                      value={showTracklist}
                      onChange={(newValue) => setShowTracklist(newValue)}
                      text={t("EDITOR_TracklistText")}
                    />
                  </StyledAnimatedInput>
                  <StyledAnimatedInput animationDelay={950}>
                    <FileInput title={t("EDITOR_Cover")} onChange={handleFileChange} text={fileName} />
                  </StyledAnimatedInput>
                  <StyledAnimatedInput animationDelay={1000}>
                    <FontInput
                      title={t("EDITOR_Font")}
                      text={customFontFile?.name || t("EDITOR_DefaultFont")}
                      onChange={setCustomFontFile}
                    />
                  </StyledAnimatedInput>
                  {showColorSelector && colorInputPosition && currentColorInput && (
                    <ColorSelector
                      DefaultColor={
                        currentColorInput === "backgroundColor"
                          ? backgroundColor
                          : currentColorInput === "textColor"
                            ? textColor
                            : currentColorInput === "color1"
                              ? color1
                              : currentColorInput === "color2"
                                ? color2
                                : color3
                      }
                      image={albumCover}
                      predefinedColors={[color1, color2, color3, backgroundColor, textColor]}
                      onDone={(selectedColor) => {
                        switch (currentColorInput) {
                          case "backgroundColor":
                            setbackgroundColor(selectedColor)
                            break
                          case "textColor":
                            setTextColor(selectedColor)
                            break
                          case "color1":
                            setcolor1(selectedColor)
                            break
                          case "color2":
                            setcolor2(selectedColor)
                            break
                          case "color3":
                            setcolor3(selectedColor)
                            break
                          default:
                            break
                        }
                        setColorInputPosition(null)
                      }}
                      position={colorInputPosition}
                      onClose={handleColorSelectorClose}
                    />
                  )}
                </EditorSettings>
              ) : (
                <TracklistContainer>
                  <TracklistTextarea
                    value={tracklist}
                    onChange={(e) => setTracklist(e.target.value)}
                    placeholder={t("EDITOR_TracklistPlaceholder")}
                  />
                  <TracklistButtonsContainer>
                    <TracklistButton onClick={handleRemoveParentheses}>{t("EDITOR_RemoveParentheses")}</TracklistButton>
                    <TracklistButton onClick={handleRemoveBrackets}>{t("EDITOR_RemoveBrackets")}</TracklistButton>
                  </TracklistButtonsContainer>
                </TracklistContainer>
              )}
              <StyledAnimatedInput animationDelay={1050}>
                <DivButtons>
                  <ButtonDiv onClick={handleDownloadClick}>
                    <IconDownload />
                    <ButtonText>{t("EDITOR_Download")}</ButtonText>
                  </ButtonDiv>
                  <ButtonDiv onClick={handleApplyClick}>
                    <IconApply $spinning={spinApplyButton} />
                    <ButtonText>{t("EDITOR_Apply")}</ButtonText>
                  </ButtonDiv>
                </DivButtons>
              </StyledAnimatedInput>
              <StyledAnimatedInput animationDelay={1100}>
                <ShortcutsInfo>
                  {t("EDITOR_Shortcuts")}: Ctrl+S ({t("EDITOR_Apply")}), Ctrl+D ({t("EDITOR_Download")})
                </ShortcutsInfo>
              </StyledAnimatedInput>
            </EditorColumn>
          </ContainerEditor>
        </Container>
      )}
    </>
  )
})

PosterEditor.displayName = "PosterEditor"

export default PosterEditor

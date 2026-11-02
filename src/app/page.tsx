import { PageMotion } from "@/animations/PageMotion";
import { CharacterArtwork } from "@/components/CharacterArtwork";
import { SagaLink } from "@/components/SagaLink";
import { TransitionLink } from "@/components/TransitionLink";
import { characters } from "@/data/characters";

export default function HomePage() {
  return <PageMotion page="home">
    <section className="hero" id="hero">
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="hero-kicker" data-hero-copy>FILE 000 / THE CHAINSAW MAN ARCHIVE</p>
          <h1 className="d"><span className="t1">CHAINSAW</span><span className="t2">MAN</span></h1>
          <p className="hero-deck" data-hero-copy>Devils. Hunters. Contracts.<br />Every story leaves a mark.</p>
          <div className="go" data-hero-copy>
            <SagaLink href="/characters" part="1">PART 1 — PUBLIC SAFETY</SagaLink>
            <SagaLink href="/arcs" part="2">PART 2 — ACADEMY</SagaLink>
          </div>
        </div>
        <div className="hero-visual">
          <div className="sun" aria-hidden="true" />
          <div className="hero-slash" aria-hidden="true" />
          <div className="hero-artwork" data-hero-art><CharacterArtwork name="Chainsaw Man" src={characters[0].artwork} priority sizes="(max-width: 760px) 88vw, 42vw" /></div>
          <span className="hero-visual-label">DENJI / THE CHAINSAW DEVIL</span>
          <span className="hero-visual-jp j" aria-hidden="true">チェンソーマン</span>
        </div>
      </div>
      <div className="hero-footer"><span>チェンソーマン</span><span>SCROLL TO EXPLORE ↓</span></div>
    </section>

    <div className="mq" aria-hidden="true"><div>DEVIL HUNTERS ★ CONTRACTS ★ BLOOD ★ HELL ★ CHAINSAW ★ DEVIL HUNTERS ★ CONTRACTS ★ BLOOD ★ HELL ★ CHAINSAW ★ </div></div>

    <section className="part p1">
      <div className="part-inner">
        <figure className="part-artwork" data-home-art>
          <CharacterArtwork name="Denji" src={characters[0].artwork} sizes="(max-width: 760px) 90vw, 38vw" />
          <figcaption>FIG. 01 / DENJI</figcaption>
        </figure>
        <div className="part-copy">
          <span className="part-kicker" data-home-reveal>01 / PUBLIC SAFETY · VOLUMES 01—11</span>
          <h2 className="d"><span data-home-line>PUBLIC</span><span data-home-line>SAFETY</span></h2>
          <p data-home-reveal>A debt-ridden teen merges with the Chainsaw Devil and joins the Public Safety Devil Hunters. His ordinary dream becomes anything but ordinary.</p>
          <div data-home-reveal><SagaLink part="1" className="btn" href="/arcs">EXPLORE PART 1 <span aria-hidden="true">↗</span></SagaLink></div>
          <span className="part-note" data-home-reveal>DEVIL HUNTERS / TOKYO / 1997</span>
        </div>
      </div>
    </section>

    <section className="part p2">
      <div className="part-inner">
        <div className="part-copy">
          <span className="part-kicker" data-home-reveal>02 / ACADEMY · VOLUME 12 ONWARD</span>
          <h2 className="d"><span data-home-line>ACADEMY</span><span data-home-line>SAGA</span></h2>
          <p data-home-reveal>Asa Mitaka, a student bound to the War Devil, collides with Denji&apos;s world. Two lives, one city, and a story still unfolding.</p>
          <div data-home-reveal><SagaLink part="2" className="btn" href="/characters">MEET THE CAST <span aria-hidden="true">↗</span></SagaLink></div>
          <span className="part-note" data-home-reveal>WAR DEVIL / FOUR HORSEMEN / 01</span>
        </div>
        <figure className="part-artwork" data-home-art>
          <CharacterArtwork name="Asa Mitaka" src={characters.find((character) => character.id === "asa")!.artwork} sizes="(max-width: 760px) 90vw, 38vw" />
          <figcaption>FIG. 02 / ASA MITAKA</figcaption>
        </figure>
      </div>
    </section>

    <section className="end">
      <div className="end-inner">
        <div className="end-content">
          <span className="end-kicker" data-home-reveal>THE ARCHIVE / NO STORY ENDS HERE</span>
          <h2 className="d"><span data-home-line>HELL</span><span data-home-line>HAS A</span><span data-home-line>HERO</span></h2>
          <div className="end-copy" data-home-reveal>
            <p>Follow the hunters, devils, places, and volumes that shape the story.</p>
            <TransitionLink className="btn" href="/characters">ENTER THE ARCHIVE <span aria-hidden="true">↗</span></TransitionLink>
            <small>CHARACTERS · DEVILS · ARCS · LOCATIONS · VOLUMES</small>
          </div>
        </div>
        <figure className="end-artwork" data-home-art>
          <CharacterArtwork name="Chainsaw Man" src={characters[0].artwork} sizes="(max-width: 760px) 85vw, 33vw" />
          <figcaption>THE STORY CONTINUES / 00</figcaption>
        </figure>
      </div>
      <div className="end-footer"><span>CHAINSAW MAN / ARCHIVE</span><span>END OF FILE — BEGIN AGAIN</span></div>
    </section>
  </PageMotion>;
}

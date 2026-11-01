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
          <p className="hero-kicker" data-hero-copy>THE CHAINSAW MAN ARCHIVE / PART 1—2</p>
          <h1 className="d"><span className="t1">CHAINSAW</span><span className="t2">MAN</span></h1>
          <p className="hero-deck" data-hero-copy>Devils. Hunters. Contracts. Every story leaves a mark.</p>
          <div className="go" data-hero-copy>
            <SagaLink href="/characters" part="1">PART 1 — PUBLIC SAFETY</SagaLink>
            <SagaLink href="/arcs" part="2">PART 2 — ACADEMY</SagaLink>
          </div>
        </div>
        <div className="hero-visual">
          <div className="sun" aria-hidden="true" />
          <div className="hero-slash" aria-hidden="true" />
          <div className="hero-artwork" data-hero-art><CharacterArtwork name="Chainsaw Man" src={characters[0].artwork} priority sizes="(max-width: 760px) 88vw, 42vw" /></div>
          <span className="hero-visual-label">01 / THE CHAINSAW DEVIL</span>
        </div>
      </div>
      <div className="hero-footer"><span>チェンソーマン</span><span>SCROLL TO EXPLORE ↓</span></div>
    </section>

    <div className="mq" aria-hidden="true"><div>DEVIL HUNTERS ★ CONTRACTS ★ BLOOD ★ HELL ★ CHAINSAW ★ DEVIL HUNTERS ★ CONTRACTS ★ BLOOD ★ HELL ★ CHAINSAW ★ </div></div>

    <section className="part p1">
      <div className="part-inner">
        <div className="part-copy">
          <span className="part-kicker" data-home-reveal>01 / THE PUBLIC SAFETY SAGA</span>
          <h2 className="d" data-home-reveal><span>PUBLIC</span><span>SAFETY</span><span>SAGA</span></h2>
          <p data-home-reveal>A debt-ridden teen merges with the Chainsaw Devil and joins the Public Safety Devil Hunters. Part 1 spans volumes 1–11 (97 chapters).</p>
          <div data-home-reveal><SagaLink part="1" className="btn" href="/arcs">EXPLORE PART 1 <span aria-hidden="true">↗</span></SagaLink></div>
        </div>
        <figure className="part-artwork" data-home-art>
          <CharacterArtwork name="Denji" src={characters[0].artwork} sizes="(max-width: 760px) 90vw, 38vw" />
          <figcaption>DENJI / ARTWORK PENDING</figcaption>
        </figure>
      </div>
    </section>

    <section className="part p2">
      <div className="part-inner">
        <figure className="part-artwork" data-home-art>
          <CharacterArtwork name="Asa Mitaka" src={characters.find((character) => character.id === "asa")!.artwork} sizes="(max-width: 760px) 90vw, 38vw" />
          <figcaption>ASA MITAKA / ARTWORK PENDING</figcaption>
        </figure>
        <div className="part-copy">
          <span className="part-kicker" data-home-reveal>02 / THE ACADEMY SAGA</span>
          <h2 className="d" data-home-reveal><span>ACADEMY</span><span>SAGA</span></h2>
          <p data-home-reveal>Asa Mitaka, a student bound to the War Devil, collides with Denji&apos;s world. Part 2 continues from volume 12.</p>
          <div data-home-reveal><SagaLink part="2" className="btn" href="/characters">MEET THE CAST <span aria-hidden="true">↗</span></SagaLink></div>
        </div>
      </div>
    </section>

    <section className="end">
      <div className="end-inner">
        <div className="end-title">
          <span className="end-kicker" data-home-reveal>THE ARCHIVE / NO STORY ENDS HERE</span>
          <h2 className="d" data-home-reveal><span>HELL</span><span>HAS A</span><span>HERO</span></h2>
        </div>
        <div className="end-copy" data-home-reveal>
          <span className="end-mark" aria-hidden="true">CSM<span>{"//"}</span></span>
          <p>Follow the hunters, devils, places, and volumes that shape the story.</p>
          <TransitionLink className="btn" href="/characters">ENTER THE ARCHIVE <span aria-hidden="true">↗</span></TransitionLink>
          <small>CHARACTERS · DEVILS · ARCS · LOCATIONS · VOLUMES</small>
        </div>
      </div>
      <div className="end-footer"><span>CHAINSAW MAN / ARCHIVE</span><span>END OF FILE — BEGIN AGAIN</span></div>
    </section>
  </PageMotion>;
}

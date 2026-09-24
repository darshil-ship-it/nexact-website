import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/types/content";
import { ButtonLink } from "@/components/ui/button";
import { Media } from "@/components/ui/media";
import { Reveal } from "@/components/ui/reveal";
import { ViewTracker } from "@/components/analytics/view-tracker";

export function ServiceSection({ service, reverse = false }: { service: Service; reverse?: boolean }) {
  return (
    <section id={service.id} className={`service-feature${reverse ? " service-feature--reverse" : ""}`} aria-labelledby={`${service.id}-title`}>
      <ViewTracker event="service_view" itemId={service.id} itemName={service.title} />
      <div className="container service-feature__layout">
        <Reveal className="service-feature__media">
          <Media asset={service.media} sizes="(max-width: 767px) 100vw, 50vw" />
        </Reveal>

        <Reveal className="service-feature__content" delay={0.08}>
          <p className="service-feature__label">{service.label}</p>
          <h2 id={`${service.id}-title`}>{service.title}</h2>
          <p className="service-feature__context">{service.context}</p>
          <p className="service-feature__description">{service.description}</p>
          <ul className="service-feature__points">
            {service.points.map((point) => <li key={point}>{point}</li>)}
          </ul>
          <ButtonLink className="service-feature__cta" href={service.cta.href}>
            {service.cta.label}
            <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.7} />
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}

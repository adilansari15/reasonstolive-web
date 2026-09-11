import { Phone, ExternalLink, Clock } from "lucide-react";

export function SupportCard({ resource }) {
  const isPhoneOrText = resource.actionHref.startsWith("tel:") || resource.actionHref.startsWith("sms:");

  return (
    <div
      id={`support-card-${resource.id}`}
      className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1C1B19] p-5 sm:p-6 transition-all hover:border-stone-350 dark:hover:border-stone-700 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
            {resource.tag}
          </span>

          {resource.country && (
            <span className="text-[11px] text-stone-400 dark:text-stone-500">
              {resource.country}
            </span>
          )}
        </div>

        <h3 className="font-serif text-lg text-stone-900 dark:text-stone-100 mb-2">
          {resource.title}
        </h3>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
          {resource.description}
        </p>

        <div className="flex items-center gap-1.5 text-xs text-stone-400 dark:text-stone-500 mb-5">
          <Clock className="w-3.5 h-3.5 text-stone-400" />
          <span>{resource.availability}</span>
        </div>
      </div>

      <div className="pt-3.5 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-3">
        <div className="text-xs font-medium text-stone-800 dark:text-stone-200">
          {resource.contact}
        </div>

        <a
          href={resource.actionHref}
          target={isPhoneOrText ? "_self" : "_blank"}
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-stone-50 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white active:scale-[0.98] transition-colors shrink-0"
        >
          {isPhoneOrText ? <Phone className="w-3 h-3" /> : <ExternalLink className="w-3 h-3" />}
          <span>{resource.actionText}</span>
        </a>
      </div>
    </div>
  );
}

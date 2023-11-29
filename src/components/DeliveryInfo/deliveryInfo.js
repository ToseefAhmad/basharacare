import { useFieldState } from 'informed';
import React, { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import Field from '@app/components/overrides/Field';
import Select from '@app/components/overrides/Select';
import TextInput from '@app/components/overrides/TextInput';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './deliveryInfo.module.css';

const DeliveryInfo = ({ deliveryInputOptions, shippingCity, selectedMethod, propClasses }) => {
    const classes = useStyle(defaultClasses, propClasses);
    const { value: date } = useFieldState('date');
    const [isWorkDay, setIsWorkDay] = useState(false);
    const { locale, formatMessage } = useIntl();

    const { available_limits, delivery_comment, delivery_day, delivery_time } = deliveryInputOptions || {};

    const shippingMethodReformat = selectedMethod.replace('|', '_');
    const methodLimits = available_limits?.find(option => option.method === shippingMethodReformat);
    const day_limits = useMemo(() => methodLimits?.day_limits || [], [methodLimits?.day_limits]);

    const getDayName = (dateStr, locale) => {
        var date = new Date(dateStr);
        return date.toLocaleDateString(locale, { weekday: 'long' });
    };

    const dayTimeLimits = useMemo(() => {
        if (date) {
            const dayLimits = day_limits.filter(day => day.date === date);
            const blacklistCities = methodLimits?.blacklist_cities;
            const isTomorrow = new Date(date).getDate() - new Date().getDate() === 1;
            if (blacklistCities && blacklistCities.includes(shippingCity) && (isTomorrow || isWorkDay)) {
                const timeLimits = dayLimits.map(time => time.time_limits)[0];
                if (timeLimits) {
                    return [
                        [
                            {
                                from: timeLimits[0].from,
                                to: timeLimits[timeLimits.length - 1].to,
                                label: isWorkDay
                                    ? formatMessage({
                                          defaultMessage: 'Receive it next workday',
                                          id: 'deliveryInfo.receiveNextWorkDay'
                                      })
                                    : formatMessage({
                                          defaultMessage: 'Receive it tomorrow',
                                          id: 'deliveryInfo.receiveTomorrow'
                                      }),
                                extraCharge: '',
                                cut_off_time: null
                            }
                        ]
                    ];
                }
            } else {
                return dayLimits.map(time => time.time_limits);
            }
        }
        return [];
    }, [date, day_limits, formatMessage, isWorkDay, methodLimits?.blacklist_cities, shippingCity]);

    const timeOptions =
        dayTimeLimits.length > 0
            ? dayTimeLimits[0].map((option, idx) => {
                  return {
                      key: idx,
                      value: `${option.from} ${option.to}`,
                      label:
                          option.label ||
                          formatMessage(
                              {
                                  defaultMessage: 'From: {from} To: {to} + {extraCharge}',
                                  id: 'deliveryInfo.timeOption'
                              },
                              {
                                  from: option.from,
                                  to: option.to,
                                  extraCharge: option.extraCharge
                              }
                          )
                  };
              })
            : [];

    const dateOptions = useMemo(() => {
        let isFiltered = false;
        let options = day_limits
            .map(({ date_formatted, date }) => {
                var day = getDayName(date, locale);
                const blacklistCities = methodLimits?.blacklist_cities;
                const isTomorrow = new Date(date).getDate() - new Date().getDate() === 1;

                if (blacklistCities && blacklistCities.includes(shippingCity) && !isTomorrow) {
                    isFiltered = true;
                    return null;
                }
                const dayWithDate =
                    date_formatted === 'Tomorrow'
                        ? formatMessage({ defaultMessage: 'Tomorrow', id: 'checkoutPage.deliveryTimeTomorrow' })
                        : `${day} ${date_formatted}`;

                return { key: date_formatted, value: date, label: dayWithDate };
            })
            .filter(Boolean);

        if (!options.length && isFiltered && methodLimits?.blacklist_cities) {
            // Find closest work day to have options for
            let foundClosest = false;
            options = day_limits
                .map(({ date_formatted, date }) => {
                    var day = getDayName(date, locale);
                    const blacklistCities = methodLimits?.blacklist_cities;
                    const isToday = new Date(date).getDate() - new Date().getDate() === 0;

                    // If we have found one already and it's not today discard them.
                    if ((blacklistCities && blacklistCities.includes(shippingCity) && isToday) || foundClosest) {
                        return null;
                    }
                    foundClosest = true;
                    setIsWorkDay(true);
                    const dayWithDate =
                        date_formatted ===
                        formatMessage({ defaultMessage: 'Tomorrow', id: 'checkoutPage.deliveryDateTomorrow' })
                            ? date_formatted
                            : `${day} ${date_formatted}`;

                    return { key: date_formatted, value: date, label: dayWithDate };
                })
                .filter(Boolean);
        }

        return options;
    }, [day_limits, locale, methodLimits, shippingCity, formatMessage]);

    if (!deliveryInputOptions || !dateOptions.length) {
        return null;
    }

    return (
        <div className={classes.root}>
            <Field
                id="date"
                label={
                    delivery_day.label_visible &&
                    formatMessage({ defaultMessage: 'Select Delivery Date', id: 'checkoutPage.deliveryDate' })
                }
            >
                <Select
                    classes={{ input: classes.selectInput }}
                    field="date"
                    setInitial={true}
                    items={dateOptions}
                    validate={delivery_day.required_entry && isRequired}
                />
            </Field>

            {dayTimeLimits.length > 0 ? (
                <Field
                    id="time"
                    label={
                        delivery_time.label_visible &&
                        formatMessage({ defaultMessage: 'Select Delivery Time', id: 'checkoutPage.deliveryTime' })
                    }
                >
                    <Select
                        classes={{ input: classes.selectInput }}
                        field="time"
                        setInitial={true}
                        items={timeOptions}
                        validate={delivery_time.required_entry && isRequired}
                    />
                </Field>
            ) : null}

            {delivery_comment.is_enabled ? (
                <div className={classes.comments}>
                    <Field
                        id="comment"
                        label={formatMessage({
                            defaultMessage: 'Comment for your delivery',
                            id: 'checkoutPage.deliveryComment'
                        })}
                    >
                        <TextInput field="comment" />
                    </Field>
                </div>
            ) : null}
        </div>
    );
};

export default DeliveryInfo;

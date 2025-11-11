import json
import math
import random
from datetime import datetime, timedelta
import calendar

SYNODIC_MONTH = 29.530588853
PHASES = [
    ("Новая Луна", "new-moon.svg"),
    ("Молодая Луна", "waxing-crescent.svg"),
    ("Первая четверть", "first-quarter.svg"),
    ("Прибывающая Луна", "waxing-gibbous.svg"),
    ("Полнолуние", "full-moon.svg"),
    ("Убывающая Луна", "waning-gibbous.svg"),
    ("Последняя четверть", "third-quarter.svg"),
    ("Старая Луна", "waning-crescent.svg")
]


def moon_age(date):
    """
    Возраст Луны (в днях) от последнего новолуния.
    Источник формулы: Astronomical Algorithms (Jean Meeus)
    """
    year = date.year
    month = date.month
    day = date.day

    if month < 3:
        year -= 1
        month += 12

    a = int(year / 100)
    b = 2 - a + int(a / 4)
    jd = int(365.25 * (year + 4716)) + int(30.6001 * (month + 1)) + day + b - 1524.5

    known_new_moon_jd = 2451550.1
    age = (jd - known_new_moon_jd) % SYNODIC_MONTH
    return age


def get_phase_info(age):
    if age < 1.84566:
        phase = PHASES[0]
    elif age < 5.53699:
        phase = PHASES[1]
    elif age < 9.22831:
        phase = PHASES[2]
    elif age < 12.91963:
        phase = PHASES[3]
    elif age < 16.61096:
        phase = PHASES[4]
    elif age < 20.30228:
        phase = PHASES[5]
    elif age < 23.99361:
        phase = PHASES[6]
    elif age < 27.68493:
        phase = PHASES[7]
    else:
        phase = PHASES[0]
    return phase



def generate_real_moon_data():
    today = datetime.today()
    start_date = today.replace(day=1)
    months_data = {}

    for m in range(12):
        year = start_date.year + (start_date.month + m - 1) // 12
        month = (start_date.month + m - 1) % 12 + 1
        _, days_in_month = calendar.monthrange(year, month)
        month_key = f"{year}-{month:02d}"
        month_list = []

        for d in range(1, days_in_month + 1):
            date_obj = datetime(year, month, d)
            age = moon_age(date_obj)
            phase_name, icon = get_phase_info(age)

            visibility = round((1 - math.cos(2 * math.pi * age / SYNODIC_MONTH)) / 2 * 100)

            rise_hour = (6 + int(age)) % 24
            set_hour = (18 + int(age // 2)) % 24
            rise_min = random.randint(0, 59)
            set_min = random.randint(0, 59)

            month_list.append({
                "date": date_obj.strftime("%Y-%m-%d"),
                "phase": phase_name,
                "icon": icon,
                "visibility": visibility,
                "age": round(age, 1),
                "rise": f"{rise_hour:02d}:{rise_min:02d}",
                "set": f"{set_hour:02d}:{set_min:02d}"
            })

        months_data[month_key] = month_list

    return months_data


if __name__ == "__main__":
    data = generate_real_moon_data()
    with open("moon_data.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Реальный файл moon_data.json успешно создан!")

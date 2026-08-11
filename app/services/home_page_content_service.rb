# Builds the static Sunday school homepage content.
class HomePageContentService
  LESSON_COUNT = 50
  DEFAULT_SELECTED_LESSON = 25
  VISIBLE_SIDE_COUNT = 2

  LessonImage = Data.define(:number, :title, :summary, :crop_position)
  ResourceLink = Data.define(:key, :title)
  Content = Data.define(:banner_alt_text, :lesson_images, :selected_lesson, :visible_lessons, :resource_links)

  RESOURCE_LINKS = [
    ResourceLink.new(key: "table-of-content", title: "Table of Content"),
    ResourceLink.new(key: "copyright", title: "Copyright"),
    ResourceLink.new(key: "curriculum-notes", title: "Curriculum Notes")
  ].freeze

  LESSON_TITLES = [
    "Creation Begins",
    "Noah Builds the Ark",
    "God's Promise Rainbow",
    "Abraham Follows God",
    "Sarah's Joyful News",
    "Isaac Learns Trust",
    "Jacob's Ladder Dream",
    "Joseph's Colorful Coat",
    "Joseph Forgives",
    "Baby Moses Is Safe",
    "Moses and the Burning Bush",
    "The Red Sea Opens",
    "Manna in the Desert",
    "The Ten Commandments",
    "Joshua and Jericho",
    "Ruth Shows Kindness",
    "Samuel Listens",
    "David the Shepherd",
    "David and Goliath",
    "Solomon Asks for Wisdom",
    "Elijah Prays",
    "Naaman Is Healed",
    "Queen Esther Is Brave",
    "Daniel Prays",
    "Daniel in the Lions' Den",
    "Jonah Learns Mercy",
    "The Good Shepherd",
    "The Good Samaritan",
    "The Lost Sheep",
    "The Prodigal Son",
    "Jesus Welcomes Children",
    "Jesus Feeds Five Thousand",
    "Jesus Calms the Storm",
    "The Wise Builder",
    "The Mustard Seed",
    "The Sower",
    "The Thankful Leper",
    "Zacchaeus Climbs a Tree",
    "Mary and Martha",
    "The Little Children",
    "The Widow's Gift",
    "Palm Sunday",
    "The Last Supper",
    "The Empty Tomb",
    "Breakfast by the Sea",
    "Peter Is Forgiven",
    "The Road to Emmaus",
    "Pentecost Joy",
    "Paul's Bright Light",
    "Love One Another"
  ].freeze

  def initialize(selected_lesson_number: DEFAULT_SELECTED_LESSON)
    @selected_lesson_number = normalize_lesson_number(selected_lesson_number)
  end

  def call
    Content.new(
      banner_alt_text: "Cartoon Sunday school Bible-times village with children listening to a teacher",
      lesson_images: lesson_images,
      selected_lesson: selected_lesson,
      visible_lessons: visible_lessons,
      resource_links: RESOURCE_LINKS
    )
  end

  private

  attr_reader :selected_lesson_number

  def selected_lesson
    lesson_images.fetch(selected_lesson_number - 1)
  end

  def visible_lessons
    ((selected_lesson_number - VISIBLE_SIDE_COUNT)..(selected_lesson_number + VISIBLE_SIDE_COUNT)).map do |lesson_number|
      lesson_images.fetch(wrapped_lesson_index(lesson_number))
    end
  end

  def lesson_images
    @lesson_images ||= LESSON_TITLES.each_with_index.map do |title, index|
      LessonImage.new(
        number: index + 1,
        title: title,
        summary: "A warm, age-friendly Bible story moment for children to explore.",
        crop_position: crop_positions.fetch(index % crop_positions.length)
      )
    end
  end

  def normalize_lesson_number(value)
    lesson_number = value.to_i
    return DEFAULT_SELECTED_LESSON unless lesson_number.between?(1, LESSON_COUNT)

    lesson_number
  end

  def wrapped_lesson_index(lesson_number)
    (lesson_number - 1) % LESSON_COUNT
  end

  def crop_positions
    [
      "8% 50%",
      "18% 48%",
      "28% 52%",
      "38% 50%",
      "48% 46%",
      "58% 54%",
      "68% 50%",
      "78% 48%",
      "88% 52%",
      "96% 50%"
    ]
  end
end
